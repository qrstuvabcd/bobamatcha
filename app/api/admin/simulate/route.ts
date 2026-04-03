import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET() {
    try {
        const today = new Date().toISOString().split("T")[0];

        const { data: question } = await supabase
            .from("daily_questions")
            .select("*")
            .eq("question_date", today)
            .single();

        const activeQuestionText = question ? question.question_text : "MOCK QUESTION: Are you a '2 AM ramen run' person or a 'Sunday dim sum' person?";

        // Fetch real answers
        let { data: answers } = await supabase
            .from("daily_answers")
            .select("*, users!inner(*)")
            .eq("question_id", question?.id || "mock-id");

        let usersPool = (answers || []).map((a: any) => ({
            name: a.users.email.split('@')[0],
            gender: a.users.gender,
            answer: a.answer_text
        }));

        // If not enough users, inject Mock users so we can see the AI simulate!
        if (usersPool.filter(u => u.gender === "male").length === 0) {
            usersPool.push({ name: "[MOCK] Kevin", gender: "male", answer: "2 AM ramen run because I thrive in the dark." });
        }
        if (usersPool.filter(u => u.gender === "female").length === 0) {
            usersPool.push({ name: "[MOCK] Tiffany", gender: "female", answer: "Honestly Sunday dim sum, I need my early morning har gow." });
        }

        const males = usersPool.filter(u => u.gender === "male");
        const females = usersPool.filter(u => u.gender === "female");

        const simulationResults = [];
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Simulate 2 random pairs
        for (let i = 0; i < Math.min(males.length, females.length, 2); i++) {
            const m = males[Math.floor(Math.random() * males.length)];
            const f = females[Math.floor(Math.random() * females.length)];

            const prompt = `You are evaluating absolute dating chemistry between two users based on their answers to today's question.
            Question: "${activeQuestionText}"
            User A (Male) Answer: "${m.answer}"
            User B (Female) Answer: "${f.answer}"
            
            Return exactly JSON: {"score": 85, "reasoning": "1 sentence funny chemistry logic"}`;

            const result = await model.generateContent(prompt);
            const text = result.response.text().trim().replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            try {
                const parsed = JSON.parse(text);
                simulationResults.push({
                    pair: `${m.name} 🧋 & ${f.name} 👸`,
                    male_answer: m.answer,
                    female_answer: f.answer,
                    gemini_score: parsed.score,
                    gemini_reasoning: parsed.reasoning
                });
            } catch (e) { }
        }

        return NextResponse.json({
            message: "This is what the Matchmaker AI sees when the 12 PM Cron fires!",
            questionContext: activeQuestionText,
            simulatedPairs: simulationResults,
            dispatchedEmails: "Bypassed for simulation.",
        }, { status: 200 },);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
