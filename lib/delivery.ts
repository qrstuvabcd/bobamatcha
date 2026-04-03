import { supabase } from "./supabase";
import { sendWhatsAppMessage } from "./whatsapp";

/**
 * Send match confirmation messages to both matched users.
 */
export async function sendMatchConfirmation(bobaRunId: string): Promise<void> {
    // Get the boba run details
    const { data: run } = await supabase
        .from("boba_runs")
        .select("*")
        .eq("id", bobaRunId)
        .single();

    if (!run) {
        console.error("Boba run not found:", bobaRunId);
        return;
    }

    // Get both users
    const { data: userA } = await supabase
        .from("users")
        .select("*")
        .eq("phone_number", run.user_a_phone)
        .single();

    const { data: userB } = await supabase
        .from("users")
        .select("*")
        .eq("phone_number", run.user_b_phone)
        .single();

    if (!userA || !userB) {
        console.error("Could not find matched users");
        return;
    }

    const timeText = run.meetup_time
        ? new Date(run.meetup_time).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        })
        : "soon";

    // Message to User A (about User B)
    const messageA = `🧋 *Boba run secured!*

Meet *${userB.name}* at *${run.venue_name}* by ${timeText}.

Their go-to order: _${userB.favorite_order}_

📍 Directions: ${run.maps_link}

📮 Address: ${run.venue_address}

Text *CANCEL* if you can't make it.`;

    // Message to User B (about User A)
    const messageB = `🧋 *Boba run secured!*

Meet *${userA.name}* at *${run.venue_name}* by ${timeText}.

Their go-to order: _${userA.favorite_order}_

📍 Directions: ${run.maps_link}

📮 Address: ${run.venue_address}

Text *CANCEL* if you can't make it.`;

    await sendWhatsAppMessage(run.user_a_phone, messageA);
    await sendWhatsAppMessage(run.user_b_phone, messageB);

    // Update run status to confirmed
    await supabase
        .from("boba_runs")
        .update({ status: "confirmed" })
        .eq("id", bobaRunId);
}

/**
 * Handle a cancellation from a user. Notifies the partner.
 */
export async function handleCancellation(phone: string): Promise<boolean> {
    // Find the user's active boba run (pending or confirmed)
    const { data: activeRuns } = await supabase
        .from("boba_runs")
        .select("*")
        .or(
            `user_a_phone.eq.${phone},user_b_phone.eq.${phone}`
        )
        .in("status", ["pending", "confirmed"])
        .order("created_at", { ascending: false })
        .limit(1);

    if (!activeRuns || activeRuns.length === 0) {
        await sendWhatsAppMessage(
            phone,
            "You don't have any active boba runs to cancel. 🤷"
        );
        return false;
    }

    const run = activeRuns[0];

    // Update run status
    await supabase
        .from("boba_runs")
        .update({ status: "cancelled" })
        .eq("id", run.id);

    // Reset both users' availability
    await supabase
        .from("users")
        .update({ availability_status: false })
        .in("phone_number", [run.user_a_phone, run.user_b_phone]);

    // Notify the partner
    const partnerPhone =
        run.user_a_phone === phone ? run.user_b_phone : run.user_a_phone;

    const { data: cancellingUser } = await supabase
        .from("users")
        .select("name")
        .eq("phone_number", phone)
        .single();

    await sendWhatsAppMessage(
        partnerPhone,
        `😔 ${cancellingUser?.name || "Your match"} had to cancel the boba run at ${run.venue_name}.\n\nNo worries — text me when you're ready for another one! 🧋`
    );

    await sendWhatsAppMessage(
        phone,
        "Run cancelled. I've let your match know. Text me anytime you're ready for another one! 🧋"
    );

    return true;
}
