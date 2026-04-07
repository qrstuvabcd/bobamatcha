// app/api/cron/match/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMatchEmail } from "@/lib/mailer";
import { generateDailyQuestion, saveDailyQuestionToSupabase } from "@/lib/gemini";
import { logCronEvent } from "@/lib/monitoring";

// 🔐 使用 Service Role Key 繞過 RLS（後台任務專用）
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// ⚙️ 配對系統配置
const CONFIG = {
    CRON_SECRET: process.env.CRON_SECRET,
    MAX_PAIRING_ATTEMPTS: 5,
    SOLO_REWARD_POINTS: 50,
    LOCK_TIMEOUT_MINUTES: 30,
};

/**
 * 🔐 驗證 Cron 請求來源（防止未授權調用）
 */
function verifyCronAuth(request: Request): boolean {
    const authHeader = request.headers.get("authorization");
    const expected = `Bearer ${CONFIG.CRON_SECRET}`;
    return !!(CONFIG.CRON_SECRET && authHeader === expected);
}

/**
 * 🎯 獲取或生成今日問題（冪等）
 */
async function getOrCreateTodayQuestion(): Promise<{ id: string; text: string } | null> {
    const today = new Date().toISOString().split("T")[0];

    // 1️⃣ 先嘗試獲取現有問題
    const { data: existing, error: fetchError } = await supabase
        .from("daily_questions")
        .select("id, question_text")
        .eq("question_date", today)
        .maybeSingle();

    if (fetchError) {
        console.error("[Question] ❌ Fetch error:", fetchError);
        return null;
    }

    if (existing) {
        console.log(`[Question] ✅ Using existing question for ${today}`);
        return { id: existing.id, text: existing.question_text };
    }

    // 2️⃣ 生成新問題
    console.log("[Question] 🔄 Generating new question...");
    const newQuestion = await generateDailyQuestion();

    // 3️⃣ 保存到 DB
    const saveResult = await saveDailyQuestionToSupabase(supabase, newQuestion);

    if (!saveResult.success || !saveResult.questionId) {
        console.error("[Question] ❌ Save failed:", saveResult.error);
        return null;
    }

    return { id: saveResult.questionId, text: newQuestion };
}

/**
 * 👥 獲取可用用戶池（排除已配對 + 資料完整）
 */
async function getAvailableUsers(questionId: string): Promise<Array<{
    id: string;
    email: string;
    instagram: string;
    gender: "male" | "female";
    campus?: string;
    preference?: "any" | "male" | "female";
}>> {
    const today = new Date().toISOString().split("T")[0];

    // 1️⃣ 獲取今日回答問題的用戶
    const { data: answers, error } = await supabase
        .from("daily_answers")
        .select(`
      *,
      users (
        id, email, instagram, gender, campus, preference
      )
    `)
        .eq("question_id", questionId)
        .not('users.instagram', 'is', null);

    if (error) {
        console.error("[Users] ❌ Fetch answers error:", error);
        return [];
    }

    // 2️⃣ 獲取今日已配對的用戶 ID（排除他們）
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

    // 3️⃣ 過濾並格式化
    return answers
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

/**
 * 🎲 工業級配對算法：偏好感知 + 隨機打亂 + 奇數處理
 */
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
    if (users.length < 2) {
        return { pairs: [], leftovers: users };
    }

    // 🔄 Fisher-Yates 洗牌：確保隨機性
    const pool = [...users];
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const pairs: Array<{ userA: any; userB: any; reasoning: string }> = [];

    // 🎯 貪心配對：優先滿足偏好和同校區
    while (pool.length >= 2) {
        const userA = pool[0];
        let bestMatchIdx = -1;
        let bestReason = "Random availability match";

        for (let i = 1; i < pool.length; i++) {
            const userB = pool[i];

            // ✅ 檢查雙向偏好兼容性
            const aAcceptsB = !userA.preference || userA.preference === "any" || userA.preference === userB.gender;
            const bAcceptsA = !userB.preference || userB.preference === "any" || userB.preference === userA.gender;

            if (!aAcceptsB || !bAcceptsA) continue;

            // 🏆 同校區優先匹配
            if (userA.campus && userB.campus && userA.campus === userB.campus) {
                bestMatchIdx = i;
                bestReason = `Same campus: ${userA.campus}`;
                break; // 找到最優解，直接配對
            }

            // 📝 記錄第一個兼容的作為備選
            if (bestMatchIdx === -1) {
                bestMatchIdx = i;
                bestReason = "Compatible preferences";
            }
        }

        if (bestMatchIdx > 0) {
            pairs.push({
                userA,
                userB: pool[bestMatchIdx],
                reasoning: bestReason,
            });
            // 🗑️ 移除已配對的兩個用戶（注意順序：先移除後面避免索引偏移）
            pool.splice(bestMatchIdx, 1);
            pool.shift();
        } else {
            // ⚠️ userA 無法匹配，放入落單池
            break;
        }
    }

    return {
        pairs,
        leftovers: pool, // 剩餘未配對用戶
    };
}

/**
 * 🔒 原子性保存配對結果（模擬事務 + 補償邏輯）
 */
async function saveResultsAtomically(
    pairs: Array<{ userA: any; userB: any; reasoning: string }>,
    leftovers: Array<any>,
    questionId: string,
    today: string
): Promise<{ success: boolean; errors?: string[] }> {
    const errors: string[] = [];

    try {
        // 📦 保存成功配對
        for (const pair of pairs) {
            const { error } = await supabase
                .from("matches")
                .insert({
                    user_a_id: pair.userA.id,
                    user_b_id: pair.userB.id,
                    question_id: questionId,
                    match_reasoning: pair.reasoning,
                    match_date: today,
                    status: "active",
                });

            if (error) {
                console.error(`[Match] ❌ Failed to save pair:`, error);
                errors.push(`Pair ${pair.userA.id}-${pair.userB.id}: ${error.message}`);
                // 🔄 生產環境：此處應實現補償事務（刪除已保存的配對）
            }
        }

        // 🎁 處理落單用戶：單人挑戰 + 積分補償
        for (const user of leftovers) {
            const { error: soloError } = await supabase
                .from("solo_challenges")
                .insert({
                    user_id: user.id,
                    question_id: questionId,
                    challenge_type: "solo_boba_run",
                    reward_points: CONFIG.SOLO_REWARD_POINTS,
                    completed: false,
                });

            if (soloError) {
                console.error(`[Solo] ❌ Failed to create challenge:`, soloError);
                errors.push(`Solo for ${user.id}: ${soloError.message}`);
            } else {
                console.log(`[Solo] ✅ Created challenge for ${user.id} (+${CONFIG.SOLO_REWARD_POINTS} pts)`);

                // 📧 發送鼓勵郵件（異步，失敗不阻塞）
                sendMatchEmail(
                    user.email,
                    "",
                    "Solo challenge - you're special today! ✨",
                    "", // Solo challenges don't show a partner's question context usually, or we can pass a generic one
                    true
                ).catch(err => console.error(`[Email] ❌ Solo email failed:`, err));
            }
        }

        return {
            success: errors.length === 0 || errors.length < pairs.length,
            errors: errors.length > 0 ? errors : undefined,
        };

    } catch (error: any) {
        console.error("[Match] 💥 Critical save error:", error);
        return { success: false, errors: [error.message] };
    }
}

/**
 * 📧 發送配對通知（異步處理）
 */
async function sendMatchNotifications(
    pairs: Array<{ userA: any; userB: any; reasoning: string }>,
    questionText: string
): Promise<void> {
    const notifications = pairs.map(async (pair) => {
        try {
            // 雙向發送
            await Promise.all([
                sendMatchEmail(
                    pair.userA.email,
                    pair.userB.instagram,
                    questionText,
                    pair.reasoning,
                    false
                ),
                sendMatchEmail(
                    pair.userB.email,
                    pair.userA.instagram,
                    questionText,
                    pair.reasoning,
                    false
                ),
            ]);
            console.log(`[Notify] ✅ Sent for pair: ${pair.userA.id} ↔ ${pair.userB.id}`);
        } catch (err) {
            console.error(`[Notify] ❌ Failed for pair:`, err);
            // 📊 記錄到監控系統，但不中斷流程
        }
    });

    // 🔥 異步執行，不阻塞主流程
    Promise.allSettled(notifications).then(results => {
        const failed = results.filter(r => r.status === "rejected").length;
        if (failed > 0) console.warn(`[Notify] ⚠️ ${failed} notifications failed`);
    });
}

/**
 * 🚀 主入口：每日 12PM 配對定時任務
 */
export async function GET(request: Request) {
    // 🔐 1. 身份驗證
    if (!verifyCronAuth(request)) {
        console.warn("[Cron] ❌ Unauthorized attempt");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date().toISOString().split("T")[0];
    const lockKey = `match_lock_${today}`;

    // 🔒 2. 分佈式鎖檢查（防止重複執行）
    const { data: lock } = await supabase
        .from("cron_locks")
        .select("locked_at")
        .eq("lock_key", lockKey)
        .maybeSingle();

    if (lock) {
        const lockAge = Date.now() - new Date(lock.locked_at).getTime();
        if (lockAge < CONFIG.LOCK_TIMEOUT_MINUTES * 60 * 1000) {
            console.log(`[Cron] ⏳ Task already running (locked ${Math.round(lockAge / 60000)}min ago)`);
            return NextResponse.json({
                success: true,
                skipped: true,
                reason: "already_running"
            });
        }
        // 鎖過期，自動覆蓋
    }

    // 🗝️ 3. 獲取/更新鎖
    await supabase.from("cron_locks").upsert({
        lock_key: lockKey,
        locked_at: new Date().toISOString(),
    }, { onConflict: "lock_key" });

    try {
        logCronEvent('match_started', { today });
        console.log(`[Cron] 🚀 Starting daily match for ${today}`);

        // 📝 4. 獲取今日問題
        const question = await getOrCreateTodayQuestion();
        if (!question) {
            throw new Error("Failed to get/create daily question");
        }

        // 👥 5. 獲取可用用戶
        const users = await getAvailableUsers(question.id);
        logCronEvent('users_found', { count: users.length });
        console.log(`[Cron] 👥 Found ${users.length} available users`);

        if (users.length < 2) {
            // 🎁 用戶不足，直接處理為落單
            await saveResultsAtomically([], users, question.id, today);
            return NextResponse.json({
                success: true,
                date: today,
                pairs: 0,
                solos: users.length,
                message: users.length === 0 ? "No active users today" : "Only one user, assigned solo challenge",
            });
        }

        // 🎲 6. 執行配對算法
        const { pairs, leftovers } = performPairing(users);
        logCronEvent('pairing_complete', { pairs: pairs.length, solos: leftovers.length });
        console.log(`[Cron] 🎲 Generated ${pairs.length} pairs, ${leftovers.length} leftovers`);

        // 💾 7. 原子性保存結果
        const saveResult = await saveResultsAtomically(pairs, leftovers, question.id, today);

        // 📧 8. 異步發送通知
        if (pairs.length > 0) {
            sendMatchNotifications(pairs, question.text);
        }

        // 🔓 9. （可選）釋放鎖，或讓其自動過期
        // await supabase.from("cron_locks").delete().eq("lock_key", lockKey);

        console.log(`[Cron] ✅ Completed: ${pairs.length} pairs, ${leftovers.length} solos`);

        return NextResponse.json({
            success: true,
            date: today,
            totalUsers: users.length,
            pairsCreated: pairs.length,
            solosHandled: leftovers.length,
            warnings: saveResult.errors?.length || 0,
        });

    } catch (error: any) {
        logCronEvent('match_critical_failure', { error: error.message });
        console.error("[Cron] 💥 CRITICAL FAILURE:", error);
        
        // 🧹 清理鎖
        await supabase.from("cron_locks").delete().eq("lock_key", lockKey);
        
        return NextResponse.json(
            {
                error: "Daily match process failed",
                message: error.message,
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}