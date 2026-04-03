import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateDailyQuestion } from "@/lib/gemini";

export async function GET() {
    try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        // Check if we already have a question for today
        const { data: existing } = await supabase
            .from("daily_questions")
            .select("*")
            .eq("question_date", today)
            .single();

        if (existing) {
            return NextResponse.json({ question: existing });
        }

        // Generate a new question via Gemini
        const questionText = await generateDailyQuestion();

        const { data: question, error } = await supabase
            .from("daily_questions")
            .insert({
                question_text: questionText,
                question_date: today,
            })
            .select()
            .single();

        if (error) {
            console.error("Question insert error:", error);
            return NextResponse.json({ error: "Failed to generate question" }, { status: 500 });
        }

        return NextResponse.json({ question });
    } catch (error) {
        console.error("Question API error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
