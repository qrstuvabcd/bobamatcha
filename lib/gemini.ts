import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface IntentResult {
    intent: "accept_match" | "decline_match" | "chat" | "unknown";
}

/**
 * Use Gemini to classify a user's WhatsApp message intent.
 */
export async function classifyIntent(message: string): Promise<IntentResult> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `You are an intent classifier for BobaMatcha, a daily boba dating app.

Users receive a daily match at noon and must reply to accept or decline the date. Classify the user's message into one of these intents:
- "accept_match": The user is accepting the daily match offer (e.g., "yes", "I'm in", "sure", "let's do it", "down", "ok")
- "decline_match": The user is declining the match or cancelling (e.g., "no", "pass", "busy", "cancel", "can't make it", "not today")
- "chat": The user is making conversation unrelated to accepting or declining a run
- "unknown": Cannot determine intent

User message: "${message}"

Respond ONLY with valid JSON in this exact format, no markdown:
{"intent": "..."}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        // Strip markdown code fences if present
        const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleaned) as IntentResult;

        // Validate the intent value
        const validIntents = ["accept_match", "decline_match", "chat", "unknown"];
        if (!validIntents.includes(parsed.intent)) {
            return { intent: "unknown" };
        }

        return parsed;
    } catch (error) {
        console.error("Gemini classification error:", error);
        return { intent: "unknown" };
    }
}
