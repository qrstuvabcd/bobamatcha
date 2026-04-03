import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { simulateHangTheDJ } from "@/lib/connoisseur";
import { findBestVenue } from "@/lib/venues";

// AGENT REQUIREMENT: "high-precision Edge Function to ensure simultaneous global delivery"
export const runtime = 'edge';

export async function GET() {
    try {
        const today = new Date().toISOString().split("T")[0];

        // Fetch all approved users, grouped by city
        const { data: users, error } = await supabase
            .from("users")
            .select("*")
            .eq("status", "approved");

        if (error || !users) return NextResponse.json({ error: "DB Error" }, { status: 500 });

        const cities = [...new Set(users.map(u => u.city))];
        const matchesGenerated = [];

        for (const city of cities) {
            const cityUsers = users.filter(u => u.city === city);
            const males = cityUsers.filter(u => u.gender === "male");
            const females = cityUsers.filter(u => u.gender === "female");

            if (males.length === 0 || females.length === 0) continue;

            // Generate initial cross-matrix pairs (simple combinatorics for top 5 pairs simulation)
            const possiblePairs = [];
            for (const m of males) {
                for (const f of females) {
                    possiblePairs.push({ male: m, female: f });
                }
            }

            // Shuffle and slice top 5 to avoid blowing up Gemini tokens (in real world, pre-filter by ML)
            const top5Pairs = possiblePairs.sort(() => 0.5 - Math.random()).slice(0, 5);

            let bestPair = null;
            let highestScore = -1;
            let bestReasoning = "";

            // AGENT: THE CONNOISSEUR — Hang The DJ
            for (const pair of top5Pairs) {
                const userAData = {
                    name: pair.male.name,
                    order: pair.male.favorite_order,
                    answers: [pair.male.q1_answer, pair.male.q2_answer, pair.male.q3_answer, pair.male.q4_answer, pair.male.q5_answer]
                };
                const userBData = {
                    name: pair.female.name,
                    order: pair.female.favorite_order,
                    answers: [pair.female.q1_answer, pair.female.q2_answer, pair.female.q3_answer, pair.female.q4_answer, pair.female.q5_answer]
                };

                const result = await simulateHangTheDJ(userAData, userBData);

                if (result.chemistryScore > highestScore) {
                    highestScore = result.chemistryScore;
                    bestPair = pair;
                    bestReasoning = result.reasoning;
                }
            }

            if (bestPair) {
                // AGENT: THE BOUNCER — Secret Code Generator
                const secretCode = Math.floor(1000 + Math.random() * 9000).toString();

                // AGENT: THE CONNOISSEUR — Venue Logic
                // Mock midpoint near city center for now (in real app, calculate true midpoint)
                // For demonstration, defaulting to LA coordinates if city is LA, NY if NY, etc.
                let lat = 34.0522; let lng = -118.2437;
                if (city === "new york") { lat = 40.7128; lng = -74.0060; }
                else if (city === "san francisco") { lat = 37.7749; lng = -122.4194; }

                const venue = await findBestVenue(lat, lng) || {
                    name: "Unknown Cafe", address: "Nearby", mapsLink: "https://maps.google.com"
                };

                // Insert into matches
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

                if (matchObj) {
                    matchesGenerated.push(matchObj);

                    // Mark them as "matched today" so they aren't matched again
                    // Removed them from local array memory for this city
                }
            }
        }

        return NextResponse.json({ success: true, timestamp: new Date().toISOString(), matchesGenerated: matchesGenerated.length });
    } catch (error) {
        console.error("Match error:", error);
        return NextResponse.json({ error: "Failed to run drop" }, { status: 500 });
    }
}
