import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, gender, instagram, answer, questionId } = body;

        if (!email || !gender || !instagram || !answer || !questionId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Clean values
        const cleanEmail = email.trim().toLowerCase();
        const cleanIG = instagram.trim().replace("@", "");

        // 1. Upsert User (If email exists, we just retrieve the ID)
        let userId = "";
        const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", cleanEmail)
            .single();

        if (existingUser) {
            userId = existingUser.id;
        } else {
            const { data: newUser, error: userError } = await supabase
                .from("users")
                .insert({
                    email: cleanEmail,
                    gender,
                    instagram: cleanIG
                })
                .select("id")
                .single();

            if (userError || !newUser) {
                console.error("User creation error", userError);
                return NextResponse.json({ error: "Failed to create user record" }, { status: 500 });
            }
            userId = newUser.id;
        }

        // 2. Insert Daily Answer
        const today = new Date().toISOString().split("T")[0];

        // Check if already answered today
        const { data: existingAnswer } = await supabase
            .from("daily_answers")
            .select("id")
            .eq("user_id", userId)
            .eq("question_id", questionId)
            .single();

        if (existingAnswer) {
            // Already answered, just return success
            return NextResponse.json({ success: true, message: "Already dropped your answer today!" });
        }

        const { error: answerError } = await supabase
            .from("daily_answers")
            .insert({
                user_id: userId,
                question_id: questionId,
                answer_text: answer.trim(),
                answer_date: today,
            });

        if (answerError) {
            console.error("Answer insert error:", answerError);
            return NextResponse.json({ error: "Failed to save answer" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Drop API error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
