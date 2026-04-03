import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, questionId, answerText } = body;

        if (!userId || !questionId || !answerText) {
            return NextResponse.json({ error: "userId, questionId, and answerText are required" }, { status: 400 });
        }

        // Check if user already answered today's question
        const { data: existing } = await supabase
            .from("daily_answers")
            .select("id")
            .eq("user_id", userId)
            .eq("question_id", questionId)
            .single();

        if (existing) {
            return NextResponse.json({ error: "You've already answered today's question!", alreadyAnswered: true }, { status: 409 });
        }

        const today = new Date().toISOString().split("T")[0];

        const { data: answer, error } = await supabase
            .from("daily_answers")
            .insert({
                user_id: userId,
                question_id: questionId,
                answer_text: answerText.trim(),
                answer_date: today,
            })
            .select()
            .single();

        if (error) {
            console.error("Answer insert error:", error);
            return NextResponse.json({ error: "Failed to save answer" }, { status: 500 });
        }

        return NextResponse.json({ success: true, answer });
    } catch (error) {
        console.error("Answer API error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
