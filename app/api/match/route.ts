import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        const today = new Date().toISOString().split("T")[0];

        // Find today's match for this user
        const { data: matches } = await supabase
            .from("matches")
            .select("*")
            .eq("match_date", today)
            .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
            .limit(1);

        if (!matches || matches.length === 0) {
            return NextResponse.json({ match: null });
        }

        const match = matches[0];
        const partnerId = match.user_a_id === userId ? match.user_b_id : match.user_a_id;

        // Get partner's info
        const { data: partner } = await supabase
            .from("users")
            .select("id, name, favorite_order, instagram")
            .eq("id", partnerId)
            .single();

        return NextResponse.json({
            match: {
                id: match.id,
                partner,
                reasoning: match.match_reasoning,
                matchDate: match.match_date,
            }
        });
    } catch (error) {
        console.error("Match API error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
