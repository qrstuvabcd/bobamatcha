import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const now = new Date();
        const utcHour = now.getUTCHours();
        let period: string;

        if (utcHour < 20) {
            const yesterday = new Date(now);
            yesterday.setUTCDate(yesterday.getUTCDate() - 1);
            period = yesterday.toISOString().split("T")[0];
        } else {
            period = now.toISOString().split("T")[0];
        }

        // Fetch drops for the current period
        const { data: drops, error } = await supabase
            .from("daily_answers")
            .select(`
                id,
                answer_text,
                created_at,
                users (
                    email,
                    instagram,
                    gender
                )
            `)
            .eq("answer_date", period)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json({ drops, period });
    } catch (error: any) {
        console.error("Admin Drops API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
