import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateMatchPairs } from "@/lib/gemini";

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        const now = new Date();
        const utcHour = now.getUTCHours();
        let period: string;

        // Vercel runners use UTC. Midnight PST is 08:00 UTC.
        if (utcHour < 8) {
            const yesterday = new Date(now);
            yesterday.setUTCDate(yesterday.getUTCDate() - 1);
            period = yesterday.toISOString().split("T")[0];
        } else {
            period = now.toISOString().split("T")[0];
        }

        // 1. Get today's question
        const { data: questionData } = await supabase
            .from("daily_questions")
            .select("question_text")
            .eq("question_date", period)
            .single();

        if (!questionData) {
            return NextResponse.json({ error: "No question found for today." }, { status: 404 });
        }

        // 2. Fetch all drops for today
        const { data: drops, error } = await supabase
            .from("daily_answers")
            .select(`
                user_id,
                answer_text,
                users (
                    instagram,
                    gender
                )
            `)
            .eq("answer_date", period);

        if (error) throw error;
        if (!drops || drops.length < 2) {
            return NextResponse.json({ message: "Not enough participants for matching.", simulatedPairs: [] });
        }

        // 3. Categorize by gender
        const males = drops
            .filter((d: any) => d.users.gender === 'male')
            .map((d: any) => ({
                id: d.user_id,
                name: d.users.instagram,
                answer: d.answer_text,
                order: "" // Not used in current schema
            }));

        const females = drops
            .filter((d: any) => d.users.gender === 'female')
            .map((d: any) => ({
                id: d.user_id,
                name: d.users.instagram,
                answer: d.answer_text,
                order: "" // Not used in current schema
            }));

        if (males.length === 0 || females.length === 0) {
            return NextResponse.json({ message: "Not enough participants in gender pool for cross-matching.", simulatedPairs: [] });
        }

        // 4. Run Gemini matching
        const simulatedPairsRaw = await generateMatchPairs(males, females, questionData.question_text);

        // 5. Enrich with names for display
        const simulatedPairs = simulatedPairsRaw.map((pair: any) => {
            const male = males.find(m => m.id === pair.maleId);
            const female = females.find(f => f.id === pair.femaleId);
            return {
                ...pair,
                maleName: male?.name || "Unknown",
                femaleName: female?.name || "Unknown",
                maleAnswer: male?.answer || "",
                femaleAnswer: female?.answer || ""
            };
        });

        return NextResponse.json({
            message: "Simulation complete!",
            questionContext: questionData.question_text,
            simulatedPairs
        });
    } catch (error: any) {
        console.error("Simulation API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
