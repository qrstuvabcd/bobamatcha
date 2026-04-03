import { NextRequest, NextResponse } from "next/server";
import { parseWebhookMessage, sendWhatsAppMessage } from "@/lib/whatsapp";
import { handleOnboarding } from "@/lib/onboarding";
import { classifyIntent } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import { calculateMidpoint } from "@/lib/matchmaking";
import { findBestVenue } from "@/lib/venues";

// GET — WhatsApp Webhook Verification
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    // Replace this with your actual verify token from Meta App Dashboard
    const VERIFY_TOKEN = "bobamatcha_webhook_secret_123";

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return new NextResponse(challenge, { status: 200 });
    }

    return new NextResponse("Forbidden", { status: 403 });
}

// POST — Handle incoming WhatsApp messages
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Pass payload to parser
        const messageData = parseWebhookMessage(body);

        if (!messageData) {
            return NextResponse.json({ status: "ignored" });
        }

        const { from, text, latitude, longitude } = messageData;

        // 1. Process Onboarding First
        const handledByOnboarding = await handleOnboarding(
            from,
            text,
            latitude,
            longitude
        );

        if (handledByOnboarding) {
            return NextResponse.json({ status: "success" });
        }

        // If they sent a location but they are fully onboarded
        if (latitude && longitude) {
            await sendWhatsAppMessage(
                from,
                "Thanks! I've updated your location. 📍 I'll use it for your next 12 PM drop."
            );
            // In a real app we'd update their row
            return NextResponse.json({ status: "success" });
        }

        // 2. Classify intent for fully onboarded users
        if (text) {
            const { intent } = await classifyIntent(text);

            if (intent === "accept_match") {
                await handleAcceptMatch(from);
            } else if (intent === "decline_match") {
                await handleDeclineMatch(from);
            } else if (intent === "chat") {
                await sendWhatsAppMessage(
                    from,
                    "I'm just a simple matcha bot! Text me YES or NO when you receive your daily 12 PM match. 🧋"
                );
            } else {
                await sendWhatsAppMessage(
                    from,
                    "I didn't quite catch that. Your daily match drops at 12 PM — just reply YES or NO then! 🍵"
                );
            }
        }

        return NextResponse.json({ status: "success" });
    } catch (error) {
        console.error("Webhook processing error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

/**
 * Handle "YES" / accept opt-in
 */
async function handleAcceptMatch(phone: string): Promise<void> {
    // Find active match offered
    const { data: activeRuns } = await supabase
        .from("boba_runs")
        .select("*")
        .or(`user_a_phone.eq.${phone},user_b_phone.eq.${phone}`)
        .eq("status", "offered")
        .order("created_at", { ascending: false })
        .limit(1);

    if (!activeRuns || activeRuns.length === 0) {
        await sendWhatsAppMessage(
            phone,
            "You don't have any active match offers! Matches drop every day at 12 PM. 🍵"
        );
        return;
    }

    const run = activeRuns[0];
    const isUserA = run.user_a_phone === phone;
    const partnerPhone = isUserA ? run.user_b_phone : run.user_a_phone;

    // Update their status
    const updatePayload = isUserA ? { user_a_accepted: true } : { user_b_accepted: true };
    await supabase.from("boba_runs").update(updatePayload).eq("id", run.id);

    // Check if partner accepted
    const partnerAccepted = isUserA ? run.user_b_accepted : run.user_a_accepted;

    if (partnerAccepted === true) {
        // BOTH ACCEPTED! Time to create the date.
        await finalizeBobaDate(run.id, phone, partnerPhone);
    } else if (partnerAccepted === false) {
        // Partner declined already
        await sendWhatsAppMessage(
            phone,
            "Ah, unfortunately your match has already passed on today's run. We'll find you someone new tomorrow at 12 PM! 🧋"
        );
    } else {
        // Partner hasn't answered yet
        await sendWhatsAppMessage(
            phone,
            "Awesome! You're in. 🍵 I'm waiting for them to confirm, and then I'll pick the boba spot!"
        );
    }
}

/**
 * Handle "NO" / decline opt-in
 */
async function handleDeclineMatch(phone: string): Promise<void> {
    const { data: runs } = await supabase
        .from("boba_runs")
        .select("*")
        .or(`user_a_phone.eq.${phone},user_b_phone.eq.${phone}`)
        .in("status", ["offered", "confirmed"])
        .order("created_at", { ascending: false })
        .limit(1);

    if (!runs || runs.length === 0) {
        await sendWhatsAppMessage(phone, "You don't have an active match to cancel right now.");
        return;
    }

    const run = runs[0];
    const isUserA = run.user_a_phone === phone;
    const partnerPhone = isUserA ? run.user_b_phone : run.user_a_phone;

    const updatePayload = isUserA ? { user_a_accepted: false } : { user_b_accepted: false };

    if (run.status === "confirmed") {
        // Cancelling after confirming
        await supabase.from("boba_runs").update({ status: "cancelled", ...updatePayload }).eq("id", run.id);

        // Let partner know
        const { data: current } = await supabase.from("users").select("name").eq("phone_number", phone).single();
        await sendWhatsAppMessage(partnerPhone, `😔 ${current?.name || "Your date"} had to cancel the boba run at ${run.venue_name}. We'll drop a new match for you tomorrow at 12 PM!`);

        await sendWhatsAppMessage(phone, "I've cancelled the run and let your match know. See you tomorrow at 12 PM for the next drop! 🍵");
    } else {
        // Declining initial offer
        await supabase.from("boba_runs").update({ status: "declined", ...updatePayload }).eq("id", run.id);

        // If partner had already accepted, let them know it fell through
        const partnerAccepted = isUserA ? run.user_b_accepted : run.user_a_accepted;
        if (partnerAccepted === true) {
            await sendWhatsAppMessage(partnerPhone, `Ah man, your match couldn't make it today. 😔 I'll find you a new perfect match tomorrow at 12 PM!`);
        }

        await sendWhatsAppMessage(phone, "No worries! Passing on today's drop. I'll send you a new curated match tomorrow at 12 PM! 🍵");
    }
}

/**
 * Find venue and send final confirmations
 */
async function finalizeBobaDate(runId: string, phoneA: string, phoneB: string) {
    // 1. Get both user locations
    const { data: userA } = await supabase.from("users").select("name, favorite_order, location").eq("phone_number", phoneA).single();
    const { data: userB } = await supabase.from("users").select("name, favorite_order, location").eq("phone_number", phoneB).single();

    if (!userA?.location || !userB?.location) return;

    const locA = parsePoint(userA.location);
    const locB = parsePoint(userB.location);

    if (!locA || !locB) return;

    // 2. Find Midpoint
    const midpoint = calculateMidpoint(locA.lat, locA.lng, locB.lat, locB.lng);

    // 3. Find Venue
    const venue = await findBestVenue(midpoint.lat, midpoint.lng);

    if (!venue) {
        await sendWhatsAppMessage(phoneA, "Ah! We couldn't find a good open cafe between you two right now. We'll cancel this one and match you tomorrow! 😔");
        await sendWhatsAppMessage(phoneB, "Ah! We couldn't find a good open cafe between you two right now. We'll cancel this one and match you tomorrow! 😔");
        await supabase.from("boba_runs").update({ status: "cancelled" }).eq("id", runId);
        return;
    }

    // 4. Update Run to Confirmed
    // Set meetup time to +45 minutes from now for spontaneity
    const meetupTime = new Date();
    meetupTime.setMinutes(meetupTime.getMinutes() + 45);

    await supabase.from("boba_runs").update({
        status: "confirmed",
        venue_name: venue.name,
        venue_address: venue.address,
        maps_link: venue.mapsLink,
        meetup_time: meetupTime.toISOString()
    }).eq("id", runId);

    // 5. Build final messages
    const timeText = meetupTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    const messageA = `🧋 *It's a MATCHA!*
    
Both of you accepted. Go meet *${userB.name}* at *${venue.name}* around ${timeText}.

Their go-to order: _${userB?.favorite_order || "Dealers choice"}_

📍 Directions: ${venue.mapsLink}
📮 Address: ${venue.address}

Text *CANCEL* if anything comes up. Have fun! 🍵`;

    const messageB = `🧋 *It's a MATCHA!*
    
Both of you accepted. Go meet *${userA.name}* at *${venue.name}* around ${timeText}.

Their go-to order: _${userA?.favorite_order || "Dealers choice"}_

📍 Directions: ${venue.mapsLink}
📮 Address: ${venue.address}

Text *CANCEL* if anything comes up. Have fun! 🍵`;

    await sendWhatsAppMessage(phoneA, messageA);
    await sendWhatsAppMessage(phoneB, messageB);
}

// Helper to parse PostGIS POINT
function parsePoint(location: string | Record<string, unknown>): { lat: number; lng: number } | null {
    if (typeof location === "string" && location.startsWith("POINT(")) {
        const matches = location.match(/POINT\(([\d.-]+) ([\d.-]+)\)/);
        if (matches && matches.length === 3) {
            return { lng: parseFloat(matches[1]), lat: parseFloat(matches[2]) };
        }
    }
    return null;
}
