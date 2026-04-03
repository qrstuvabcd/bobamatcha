import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { simulateHangTheDJ } from "@/lib/connoisseur";
import { findBestVenue } from "@/lib/venues";

export const runtime = 'edge';

export async function GET() {
    try {
        const today = new Date().toISOString().split("T")[0];

        // 1. Get today's question
        const { data: question, error: qError } = await supabase
            .from("daily_questions")
            .select("*")
            .eq("question_date", today)
            .single();

        if (qError || !question) return NextResponse.json({ error: "No question found for today" }, { status: 404 });

        // 2. Fetch all answers for today's question, joined with approved users
        const { data: answers, error: aError } = await supabase
            .from("daily_answers")
            .select("*, users!inner(*)")
            .eq("question_id", question.id)
            .eq("users.status", "approved");

        if (aError || !answers) return NextResponse.json({ message: "No approved answers today" });

        // Format user pool
        const usersPool = answers.map((a: any) => ({
            id: a.users.id,
            name: a.users.name,
            gender: a.users.gender,
            city: a.users.city,
            order: a.users.favorite_order || "Surprise me",
            answer: a.answer_text
        }));

        const cities = [...new Set(usersPool.map(u => u.city))];
        const matchesGenerated = [];

        for (const city of cities) {
            const cityUsers = usersPool.filter(u => u.city === city);
            const males = cityUsers.filter(u => u.gender === "male");
            const females = cityUsers.filter(u => u.gender === "female");

            if (males.length === 0 || females.length === 0) continue;

            const possiblePairs = [];
            for (const m of males) {
                for (const f of females) {
                    possiblePairs.push({ male: m, female: f });
                }
            }

            const top5Pairs = possiblePairs.sort(() => 0.5 - Math.random()).slice(0, 5);

            let bestPair = null;
            let highestScore = -1;
            let bestReasoning = "";

            // AGENT: THE CONNOISSEUR — Hang The DJ
            for (const pair of top5Pairs) {
                const userAData = { name: pair.male.name, order: pair.male.order, answer: pair.male.answer };
                const userBData = { name: pair.female.name, order: pair.female.order, answer: pair.female.answer };

                const result = await simulateHangTheDJ(userAData, userBData);

                if (result.chemistryScore > highestScore) {
                    highestScore = result.chemistryScore;
                    bestPair = pair;
                    bestReasoning = result.reasoning;
                }
            }

            if (bestPair) {
                const secretCode = Math.floor(1000 + Math.random() * 9000).toString();

                let lat = 34.0522; let lng = -118.2437;
                if (city === "new york") { lat = 40.7128; lng = -74.0060; }
                else if (city === "san francisco") { lat = 37.7749; lng = -122.4194; }

                const venue = await findBestVenue(lat, lng) || {
                    name: "Unknown Cafe", address: "Nearby", mapsLink: "https://maps.google.com"
                };

                const { data: matchObj } = await supabase
                    .from("matches")
                    .insert({
                        user_a_id: bestPair.male.id,
                        user_b_id: bestPair.female.id,
                        match_reasoning: bestReasoning,
                        hang_the_dj_score: highestScore,
                        secret_code: secretCode,
                        venue_name: venue.name,
                        venue_address: venue.address,
                        maps_link: venue.mapsLink,
                        match_date: today,
                    })
                    .select()
                    .single();

                if (matchObj) matchesGenerated.push(matchObj);
            }
        }

        return NextResponse.json({ success: true, timestamp: new Date().toISOString(), matchesGenerated: matchesGenerated.length });
    } catch (error) {
        console.error("Match error:", error);
        return NextResponse.json({ error: "Failed to run drop" }, { status: 500 });
    }
}
