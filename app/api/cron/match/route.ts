import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { sendMatchEmail } from "@/lib/mailer";

export const runtime = 'edge';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET() {
    try {
        const today = new Date().toISOString().split("T")[0];

        const { data: question, error: qError } = await supabase
            .from("daily_questions")
            .select("*")
            .eq("question_date", today)
            .single();

        if (qError || !question) return NextResponse.json({ error: "No question found for today" }, { status: 404 });

        // Fetch all answers
        const { data: answers, error: aError } = await supabase
            .from("daily_answers")
            .select("*, users!inner(*)")
            .eq("question_id", question.id);

        if (aError || !answers) return NextResponse.json({ message: "No answers today" });

        const usersPool = answers.map((a: any) => ({
            id: a.users.id,
            email: a.users.email,
            gender: a.users.gender,
            instagram: a.users.instagram,
            answer: a.answer_text
        }));

        const males = usersPool.filter(u => u.gender === "male");
        const females = usersPool.filter(u => u.gender === "female");

        if (males.length === 0 || females.length === 0) {
            return NextResponse.json({ message: "Not enough participants in gender pool for cross-matching." });
        }

        const possiblePairs = [];
        for (const m of males) {
            for (const f of females) {
                possiblePairs.push({ male: m, female: f });
            }
        }

        // Evaluate Top 5 Pairs for cost
        const top5Pairs = possiblePairs.sort(() => 0.5 - Math.random()).slice(0, 5);
        let bestPair = null;
        let highestScore = -1;
        let bestReasoning = "";

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        for (const pair of top5Pairs) {
            const prompt = `You are evaluating absolute dating chemistry between two users based on their answers to today's question.
            Question: "${question.question_text}"
            User A (Male) Answer: "${pair.male.answer}"
            User B (Female) Answer: "${pair.female.answer}"
            
            Return exactly JSON: {"score": 85, "reasoning": "1 sentence funny chemistry logic"}`;

            const result = await model.generateContent(prompt);
            const text = result.response.text().trim().replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            try {
                const parsed = JSON.parse(text);
                if (parsed.score > highestScore) {
                    highestScore = parsed.score;
                    bestPair = pair;
                    bestReasoning = parsed.reasoning;
                }
            } catch (e) { }
        }

        if (bestPair) {
            // Save Match
            const { data: matchObj } = await supabase
                .from("matches")
                .insert({
                    user_a_id: bestPair.male.id,
                    user_b_id: bestPair.female.id,
                    match_reasoning: bestReasoning,
                    match_date: today,
                })
                .select().single();

            // Fire Emails
            await sendMatchEmail(bestPair.male.email, bestPair.female.instagram, bestReasoning);
            await sendMatchEmail(bestPair.female.email, bestPair.male.instagram, bestReasoning);

            return NextResponse.json({ success: true, matchFired: matchObj.id });
        }

        return NextResponse.json({ success: true, message: "No viable pairs found" });
    } catch (error) {
        console.error("Cron match error:", error);
        return NextResponse.json({ error: "Failed to run drop" }, { status: 500 });
    }
}
