import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendMatchEmail } from "@/lib/mailer";
import { generateMatchPairs, generateDailyQuestion, generateAiBobaAnswer } from "@/lib/gemini";

export const runtime = 'nodejs';

/**
 * Get the current "question period" date string.
 * Must match the logic in /api/question/route.ts exactly.
 */
function getQuestionPeriod(): string {
    const now = new Date();
    // Vercel runners use UTC. Midnight PST is 08:00 UTC.
    // If it's before 08:00 UTC, we are still in "yesterday's" PST period.
    const utcHour = now.getUTCHours();
    if (utcHour < 8) {
        const yesterday = new Date(now);
        yesterday.setUTCDate(yesterday.getUTCDate() - 1);
        return yesterday.toISOString().split("T")[0];
    }
    return now.toISOString().split("T")[0];
}

export async function GET() {
    try {
        const today = getQuestionPeriod();

        // 1. Get today's question (or generate it)
        let { data: question, error: qError } = await supabase
            .from("daily_questions")
            .select("*")
            .eq("question_date", today)
            .single();

        if (qError || !question) {
            console.log(`[CRON] No question found for ${today}. Generating...`);
            const text = await generateDailyQuestion();
            const aiAnswer = await generateAiBobaAnswer(text);
            const { data: newQ, error: nqError } = await supabase
                .from("daily_questions")
                .insert({ question_text: text, ai_answer: aiAnswer, question_date: today })
                .select().single();
            
            if (nqError || !newQ) throw new Error("Failed to auto-generate question");
            question = newQ;
        }

        // 2. Fetch all answers for this question
        const { data: answers, error: aError } = await supabase
            .from("daily_answers")
            .select("*, users!inner(*)")
            .eq("question_id", question.id);

        if (aError || !answers || answers.length < 2) {
            return NextResponse.json({ message: "Not enough participants for matching today." });
        }

        const usersPool = (answers as any[]).map((a: any) => ({
            id: a.users.id,
            email: a.users.email,
            gender: a.users.gender,
            instagram: a.users.instagram,
            answer: a.answer_text,
            name: a.users.instagram
        }));

        const males = usersPool.filter(u => u.gender === "male");
        const females = usersPool.filter(u => u.gender === "female");

        if (males.length === 0 || females.length === 0) {
            return NextResponse.json({ message: "Not enough participants in gender pool for cross-matching." });
        }

        // 3. Run Global AI Matching
        console.log(`[CRON] Matching ${males.length} males and ${females.length} females...`);
        const pairs = await generateMatchPairs(males as any, females as any, question.question_text);
        
        if (!pairs || pairs.length === 0) {
            return NextResponse.json({ message: "AI did not generate any matches." });
        }

        // 4. Process all matches
        const results = [];
        for (const pair of pairs) {
            try {
                // Save Match Record
                const { data: matchObj, error: matchError } = await supabase
                    .from("matches")
                    .insert({
                        user_a_id: pair.maleId,
                        user_b_id: pair.femaleId,
                        match_reasoning: pair.reasoning,
                        match_date: today,
                    })
                    .select().single();

                if (matchError) throw matchError;

                // Fetch full user details for emailing
                const maleUser = males.find(m => m.id === pair.maleId);
                const femaleUser = females.find(f => f.id === pair.femaleId);

                if (maleUser && femaleUser) {
                    // Send Emails
                    await sendMatchEmail(maleUser.email, femaleUser.instagram, pair.reasoning);
                    await sendMatchEmail(femaleUser.email, maleUser.instagram, pair.reasoning);
                }

                results.push({ matchId: matchObj.id, male: pair.maleId, female: pair.femaleId });
            } catch (err) {
                console.error(`[CRON ERROR] Failed to process pair:`, err);
            }
        }

        return NextResponse.json({ 
            success: true, 
            matchesGenerated: results.length,
            matches: results 
        });

    } catch (error) {
        console.error("Cron match error:", error);
        return NextResponse.json({ error: "Failed to run daily drop" }, { status: 500 });
    }
}
