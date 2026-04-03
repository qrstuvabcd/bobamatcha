const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0";

/**
 * Send a text message via WhatsApp Cloud API.
 */
export async function sendWhatsAppMessage(
    to: string,
    text: string
): Promise<void> {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
        console.error("WhatsApp API credentials not configured");
        return;
    }

    const response = await fetch(
        `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to,
                type: "text",
                text: { body: text },
            }),
        }
    );

    if (!response.ok) {
        const err = await response.text();
        console.error("WhatsApp API error:", err);
    }
}

/**
 * Send a location request prompt to a user.
 */
export async function sendLocationRequest(to: string): Promise<void> {
    await sendWhatsAppMessage(
        to,
        "📍 Almost there! Please share your location so we can find cafés near you.\n\nTap the + button → Location → Send Your Current Location."
    );
}

/**
 * Parse an incoming WhatsApp webhook payload and extract message details.
 */
export function parseWebhookMessage(body: Record<string, unknown>): {
    from: string;
    text?: string;
    latitude?: number;
    longitude?: number;
} | null {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const entry = (body as any)?.entry?.[0];
        const change = entry?.changes?.[0];
        const value = change?.value;
        const message = value?.messages?.[0];

        if (!message) return null;

        const from: string = message.from;

        // Text message
        if (message.type === "text") {
            return { from, text: message.text.body };
        }

        // Location message
        if (message.type === "location") {
            return {
                from,
                latitude: message.location.latitude,
                longitude: message.location.longitude,
            };
        }

        return { from };
    } catch {
        return null;
    }
}
