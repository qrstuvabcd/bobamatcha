import { supabase } from "./supabase";
import { sendWhatsAppMessage, sendLocationRequest } from "./whatsapp";

/**
 * Handle the onboarding flow for a new or partially-onboarded user.
 * Returns true if the message was handled by onboarding.
 */
export async function handleOnboarding(
    phone: string,
    text?: string,
    latitude?: number,
    longitude?: number
): Promise<boolean> {
    // Check if user exists
    const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("phone_number", phone)
        .single();

    // ── Brand new user ──
    if (!user) {
        await supabase.from("users").insert({
            phone_number: phone,
            onboarding_step: "awaiting_name",
        });

        await sendWhatsAppMessage(
            phone,
            "🧋 Welcome to BobaMatcha!\n\nI'm your AI concierge for spontaneous boba & matcha runs with people nearby.\n\nLet's get you set up — What's your first name?"
        );
        return true;
    }

    // Already fully onboarded
    if (user.onboarding_step === "complete") {
        return false;
    }

    // ── Step: awaiting_name ──
    if (user.onboarding_step === "awaiting_name") {
        if (!text || text.trim().length === 0) {
            await sendWhatsAppMessage(phone, "What's your first name?");
            return true;
        }

        const name = text.trim().slice(0, 50);

        await supabase
            .from("users")
            .update({ name, onboarding_step: "awaiting_order" })
            .eq("phone_number", phone);

        await sendWhatsAppMessage(
            phone,
            `Nice to meet you, ${name}! 🎉\n\nWhat's your go-to boba or matcha order? (e.g., "Oat milk matcha latte" or "Brown sugar tiger milk tea")`
        );
        return true;
    }

    // ── Step: awaiting_order ──
    if (user.onboarding_step === "awaiting_order") {
        if (!text || text.trim().length === 0) {
            await sendWhatsAppMessage(
                phone,
                'What\'s your go-to order? (e.g., "Taro milk tea with boba")'
            );
            return true;
        }

        const favorite_order = text.trim().slice(0, 200);

        await supabase
            .from("users")
            .update({ favorite_order, onboarding_step: "awaiting_location" })
            .eq("phone_number", phone);

        await sendLocationRequest(phone);
        return true;
    }

    // ── Step: awaiting_location ──
    if (user.onboarding_step === "awaiting_location") {
        if (latitude == null || longitude == null) {
            await sendLocationRequest(phone);
            return true;
        }

        // Store as PostGIS geography point
        const point = `POINT(${longitude} ${latitude})`;

        await supabase
            .from("users")
            .update({
                location: point,
                onboarding_step: "complete",
            })
            .eq("phone_number", phone);

        await sendWhatsAppMessage(
            phone,
            `You're all set, ${user.name}! 🎉🧋\n\nAnytime you're craving boba or matcha, just text me something like:\n• "I need boba"\n• "Matcha run?"\n• "Let's go!"\n\nI'll find someone nearby and pick the perfect café. Let's go! 🍵`
        );
        return true;
    }

    return false;
}
