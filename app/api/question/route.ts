import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateDailyQuestion } from "@/lib/gemini";

export const dynamic = 'force-dynamic';

/**
 * Get the current "question period" date string.
 * A period runs from noon on one day to noon the next day.
 * Before noon today → use yesterday's date as the period.
 * After noon today → use today's date as the period.
 * This ensures the question resets at exactly 12:00 PM.
 */
function getQuestionPeriod(): string {
    const now = new Date();
    // Vercel runners use UTC. Midnight PST is 08:00 UTC.
    // If it's before 08:00 UTC, we are still in "yesterday's" PST period.
    const utcHour = now.getUTCHours();

    if (utcHour < 8) {
        // Before Midnight PST — use yesterday's date
        const yesterday = new Date(now);
        yesterday.setUTCDate(yesterday.getUTCDate() - 1);
        return yesterday.toISOString().split("T")[0];
    }
    // After Midnight PST — use today's date
    return now.toISOString().split("T")[0];
}

export async function GET() {
    try {
        const period = getQuestionPeriod();

        // Check if we already have a question for this period
        const { data: existing } = await supabase
            .from("daily_questions")
            .select("*")
            .eq("question_date", period)
            .single();

        if (existing) {
            return NextResponse.json({ question: existing });
        }

        // Generate a new question and AI answer for this period
        const questionText = await generateDailyQuestion();
        const { generateAiBobaAnswer } = await import("@/lib/gemini");
        const aiAnswer = await generateAiBobaAnswer(questionText);

        const { data: question, error: insertError } = await supabase
            .from("daily_questions")
            .insert({
                question_text: questionText,
                ai_answer: aiAnswer,
                question_date: period,
            })
            .select()
            .single();

        if (insertError) {
            console.error("Question insert error:", insertError);
            return NextResponse.json({ error: "Failed to generate question", details: insertError }, { status: 500 });
        }

        return NextResponse.json({ question });
    } catch (error) {
        console.error("Question API error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
