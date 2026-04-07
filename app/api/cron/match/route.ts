// app/api/cron/match/route.ts - BobaMatcha Daily Pairing System (Production Ready)
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMatchEmail } from "@/lib/mailer";
import { generateDailyQuestion, saveDailyQuestionToSupabase } from "@/lib/gemini";

// ?? ä½¿ç”¨ Service Role Keyï¼ˆå?ç«¯å??¨ï?
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

const CONFIG = {
  CRON_SECRET: process.env.CRON_SECRET,
  SOLO_REWARD_POINTS: 50,
  LOCK_TIMEOUT_MINUTES: 30,
};

function verifyCronAuth(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${CONFIG.CRON_SECRET}`;
  return !!(CONFIG.CRON_SECRET && authHeader === expected);
}

async function getOrCreateTodayQuestion(): Promise<{ id: string; text: string } | null> {
  const today = new Date().toISOString().split("T")[0];
  
  const { data: existing, error: fetchError } = await supabase
    .from("daily_questions")
    .select("id, question_text")
    .eq("question_date", today)
    .maybeSingle();
  
  if (fetchError) {
    console.error("[Question] ??Fetch error:", fetchError);
    return null;
  }
  
  if (existing) {
    console.log(`[Question] ??Using existing question for ${today}`);
    return { id: existing.id, text: existing.question_text };
  }
  
  console.log("[Question] ?? Generating new question...");
  const newQuestion = await generateDailyQuestion();
  
  const saveResult = await saveDailyQuestionToSupabase(supabase, newQuestion);
  
  if (!saveResult.success || !saveResult.questionId) {
    console.error("[Question] ??Save failed:", saveResult.error);
    return null;
  }
  
  return { id: saveResult.questionId, text: newQuestion };
}

async function getAvailableUsers(questionId: string): Promise<Array<{
  id: string;
  email: string;
  instagram: string;
  gender: "male" | "female";
  campus?: string;
  preference?: "any" | "male" | "female";
}>> {
  const today = new Date().toISOString().split("T")[0];
  
  const { data: answers, error } = await supabase
    .from("daily_answers")
    .select(`*, users (id, email, instagram, gender, campus, preference)`)
    .eq("question_id", questionId)
    .not('users.instagram', 'is', null);
  
  if (error) {
    console.error("[Users] ??Fetch answers error:", error);
    return [];
  }
  
  const { data: matches, error: matchError } = await supabase
    .from("matches")
    .select("user_a_id, user_b_id")
    .eq("match_date", today)
    .eq("status", "active");
  
  const pairedIds = new Set<string>();
  if (!matchError && matches) {
    matches.forEach(m => {
      pairedIds.add(m.user_a_id);
      pairedIds.add(m.user_b_id);
    });
  }
  
  return (answers || [])
    .filter(a => a.users && !pairedIds.has(a.users.id))
    .map(a => ({
      id: a.users.id,
      email: a.users.email,
      instagram: a.users.instagram,
      gender: a.users.gender as "male" | "female",
      campus: a.users.campus,
      preference: a.users.preference as "any" | "male" | "female" | undefined,
    }));
}

function performPairing(
  users: Array<{
    id: string;
    gender: "male" | "female";
    preference?: "any" | "male" | "female";
    campus?: string;
  }>
): {
  pairs: Array<{ userA: any; userB: any; reasoning: string }>;
  leftovers: Array<any>;
} {
  if (users.length < 2) return { pairs: [], leftovers: users };
  
  // ?? Fisher-Yates æ´—ç?
  const pool = [...users];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  
  const pairs: Array<{ userA: any; userB: any; reasoning: string }> = [];
  
  while (pool.length >= 2) {
    const userA = pool[0];
    let bestMatchIdx = -1;
    let bestReason = "Random availability match";
    
    for (let i = 1; i < pool.length; i++) {
      const userB = pool[i];
      
      const aAcceptsB = !userA.preference || userA.preference === "any" || userA.preference === userB.gender;
      const bAcceptsA = !userB.preference || userB.preference === "any" || userB.preference === userA.gender;
      
      if (!aAcceptsB || !bAcceptsA) continue;
      
      if (userA.campus && userB.campus && userA.campus === userB.campus) {
        bestMatchIdx = i;
        bestReason = `Same campus: ${userA.campus}`;
        break;
      }
      
      if (bestMatchIdx === -1) {
        bestMatchIdx = i;
        bestReason = "Compatible preferences";
      }
    }
    
    if (bestMatchIdx > 0) {
      pairs.push({ userA, userB: pool[bestMatchIdx], reasoning: bestReason });
      pool.splice(bestMatchIdx, 1);
      pool.shift();
    } else {
      break;
    }
  }
  
  return { pairs, leftovers: pool };
}

async function saveResultsAtomically(
  pairs: Array<{ userA: any; userB: any; reasoning: string }>,
  leftovers: Array<any>,
  questionId: string,
  today: string
): Promise<{ success: boolean; errors?: string[] }> {
  const errors: string[] = [];
  
  try {
    for (const pair of pairs) {
      const { error } = await supabase.from("matches").insert({
        user_a_id: pair.userA.id,
        user_b_id: pair.userB.id,
        question_id: questionId,
        match_reasoning: pair.reasoning,
        match_date: today,
        status: "active",
      });
      
      if (error) {
        console.error(`[Match] ??Failed to save pair:`, error);
        errors.push(`Pair ${pair.userA.id}-${pair.userB.id}: ${error.message}`);
      }
    }
    
    for (const user of leftovers) {
      const { error: soloError } = await supabase.from("solo_challenges").insert({
        user_id: user.id,
        question_id: questionId,
        challenge_type: "solo_boba_run",
        reward_points: CONFIG.SOLO_REWARD_POINTS,
        completed: false,
      });
      
      if (soloError) {
        console.error(`[Solo] ??Failed:`, soloError);
        errors.push(`Solo for ${user.id}: ${soloError.message}`);
      } else {
        console.log(`[Solo] ??Created for ${user.id} (+${CONFIG.SOLO_REWARD_POINTS} pts)`);
        sendMatchEmail(
          user.email,
          user.instagram,
          `?? ?¹åˆ¥ä»»å?ï¼å–®äººå¥¶?¶æ??°ï?å®Œæ??¯ç² ${CONFIG.SOLO_REWARD_POINTS} ç©å?ï¼`,
          "Solo challenge - you're special today! ??,
          true
        ).catch(err => console.error(`[Email] ??Solo email failed:`, err));
      }
    }
    
    return { success: errors.length === 0 || errors.length < pairs.length, errors: errors.length > 0 ? errors : undefined };
    
  } catch (error: any) {
    console.error("[Match] ?’¥ Critical error:", error);
    return { success: false, errors: [error.message] };
  }
}

async function sendMatchNotifications(
  pairs: Array<{ userA: any; userB: any; reasoning: string }>,
  questionText: string
): Promise<void> {
  const notifications = pairs.map(async (pair) => {
    try {
      await Promise.all([
        sendMatchEmail(pair.userA.email, pair.userB.instagram, questionText, pair.reasoning, false),
        sendMatchEmail(pair.userB.email, pair.userA.instagram, questionText, pair.reasoning, false),
      ]);
      console.log(`[Notify] ??Sent: ${pair.userA.id} ??${pair.userB.id}`);
    } catch (err) {
      console.error(`[Notify] ??Failed:`, err);
    }
  });
  Promise.allSettled(notifications).then(results => {
    const failed = results.filter(r => r.status === "rejected").length;
    if (failed > 0) console.warn(`[Notify] ? ï? ${failed} notifications failed`);
  });
}

export async function GET(request: Request) {
  if (!verifyCronAuth(request)) {
    console.warn("[Cron] ??Unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const today = new Date().toISOString().split("T")[0];
  const lockKey = `match_lock_${today}`;
  
  const { data: lock } = await supabase.from("cron_locks").select("locked_at").eq("lock_key", lockKey).maybeSingle();
  
  if (lock) {
    const lockAge = Date.now() - new Date(lock.locked_at).getTime();
    if (lockAge < CONFIG.LOCK_TIMEOUT_MINUTES * 60 * 1000) {
      console.log(`[Cron] ??Already running (locked ${Math.round(lockAge/60000)}min ago)`);
      return NextResponse.json({ success: true, skipped: true, reason: "already_running" });
    }
  }
  
  await supabase.from("cron_locks").upsert({ lock_key: lockKey, locked_at: new Date().toISOString() }, { onConflict: "lock_key" });
  
  try {
    console.log(`[Cron] ?? Starting daily match for ${today}`);
    
    const question = await getOrCreateTodayQuestion();
    if (!question) throw new Error("Failed to get/create daily question");
    
    const users = await getAvailableUsers(question.id);
    console.log(`[Cron] ?‘¥ Found ${users.length} available users`);
    
    if (users.length < 2) {
      await saveResultsAtomically([], users, question.id, today);
      return NextResponse.json({ success: true, date: today, pairs: 0, solos: users.length, message: users.length === 0 ? "No active users" : "Only one user, assigned solo" });
    }
    
    const { pairs, leftovers } = performPairing(users);
    console.log(`[Cron] ?Ž² Generated ${pairs.length} pairs, ${leftovers.length} leftovers`);
    
    const saveResult = await saveResultsAtomically(pairs, leftovers, question.id, today);
    
    if (pairs.length > 0) sendMatchNotifications(pairs, question.text);
    
    console.log(`[Cron] ??Completed: ${pairs.length} pairs, ${leftovers.length} solos`);
    
    return NextResponse.json({
      success: true,
      date: today,
      totalUsers: users.length,
      pairsCreated: pairs.length,
      solosHandled: leftovers.length,
      warnings: saveResult.errors?.length || 0,
    });
    
  } catch (error: any) {
    console.error("[Cron] ?’¥ CRITICAL:", error);
    await supabase.from("cron_locks").delete().eq("lock_key", lockKey);
    return NextResponse.json({ error: "Daily match failed", message: error.message, timestamp: new Date().toISOString() }, { status: 500 });
  }
}
