import { User, supabase } from "./supabase";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateOptimalPairs(users: User[]): Promise<Array<[User, User]>> {
    if (users.length < 2) return [];

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const userContext = users.map(u => ({
            phone: u.phone_number,
            name: u.name,
            order: u.favorite_order
        }));

        const prompt = `You are the AI matchmaker for BobaMatcha (a boba dating app for ABGs and ABBs).
You are given a list of users in the same geographic area. Your job is to pair them up into optimal dates based on their favorite boba orders.
Try to make fun, complementary pairs (e.g. someone who likes basic milk tea with someone who likes adventurous fruit teas, or two matcha lovers together).
If there is an odd number of users, one user will be left unmatched.

Users:
${JSON.stringify(userContext, null, 2)}

Respond ONLY with valid JSON in this exact format:
[
  ["phone_number_1", "phone_number_2"],
  ["phone_number_3", "phone_number_4"]
]`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const pairs: string[][] = JSON.parse(cleaned);

        const finalPairs: Array<[User, User]> = [];
        const userMap = new Map(users.map(u => [u.phone_number, u]));

        for (const [phoneA, phoneB] of pairs) {
            const userA = userMap.get(phoneA);
            const userB = userMap.get(phoneB);
            if (userA && userB) {
                finalPairs.push([userA, userB]);
                userMap.delete(phoneA);
                userMap.delete(phoneB);
            }
        }

        return finalPairs;
    } catch (error) {
        console.error("Gemini pairing error:", error);
        // Fallback: simple adjacent pairing
        const fallbackPairs: Array<[User, User]> = [];
        for (let i = 0; i < users.length - 1; i += 2) {
            fallbackPairs.push([users[i], users[i + 1]]);
        }
        return fallbackPairs;
    }
}

/**
 * Execute the daily match drop (12 PM).
 */
export async function runDailyMatchmaking(): Promise<void> {
    // 1. Fetch all fully onboarded users
    const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .eq("onboarding_step", "complete");

    if (error || !users || users.length === 0) {
        console.error("Failed to fetch users for daily drop", error);
        return;
    }

    // 2. Generate optimal pairs using Gemini
    const pairs = await generateOptimalPairs(users);

    // 3. For each pair, create an 'offered' boba_run and message them
    for (const [userA, userB] of pairs) {
        // Create the run
        const { data: run, error: insertError } = await supabase
            .from("boba_runs")
            .insert({
                user_a_phone: userA.phone_number,
                user_b_phone: userB.phone_number,
                status: "offered"
            })
            .select()
            .single();

        if (insertError || !run) {
            console.error("Failed to insert run", insertError);
            continue;
        }

        // Notify User A
        const msgA = `🧋 *It's 12 PM! Here is your daily BobaMatcha drop.*

You matched with *${userB.name}*.
Their go-to order is: _${userB.favorite_order}_

Want to grab boba with them?
Reply *YES* to accept or *NO* to pass.`;

        // Notify User B
        const msgB = `🧋 *It's 12 PM! Here is your daily BobaMatcha drop.*

You matched with *${userA.name}*.
Their go-to order is: _${userA.favorite_order}_

Want to grab boba with them?
Reply *YES* to accept or *NO* to pass.`;

        // Assuming sendWhatsAppMessage exists.. we'll need to import it
        const { sendWhatsAppMessage } = await import("./whatsapp");
        await sendWhatsAppMessage(userA.phone_number, msgA);
        await sendWhatsAppMessage(userB.phone_number, msgB);
    }
}
