import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

function getQuestionPeriod(): string {
    const now = new Date();
    const utcHour = now.getUTCHours();
    if (utcHour < 20) {
        const yesterday = new Date(now);
        yesterday.setUTCDate(yesterday.getUTCDate() - 1);
        return yesterday.toISOString().split("T")[0];
    }
    return now.toISOString().split("T")[0];
}

export async function GET() {
    try {
        const period = getQuestionPeriod();
        
        // Find the question to delete its associated answers first to prevent foreign key errors
        const { data: question } = await supabase
            .from("daily_questions")
            .select("id")
            .eq("question_date", period)
            .single();

        if (question) {
            // Delete answers
            await supabase.from("daily_answers").delete().eq("question_id", question.id);
            
            // Delete today's question to force regeneration
            const { error } = await supabase
                .from("daily_questions")
                .delete()
                .eq("question_date", period);

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true, message: `Question for period ${period} reset. Navigate to the homepage to trigger Gemini generation!` });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
