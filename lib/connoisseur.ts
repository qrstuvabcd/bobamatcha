import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Connoisseur Verification logic:
 * Analyze the daily question answer using Gemini's 'Emotion Detection' to score sincerity.
 * If the tone is too generic or AI-generated, flag as 'normie' and waitlist.
 */
export async function verifyVibeSincerity(answer: string): Promise<"approved" | "waitlisted"> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `You are the Connoisseur, an elite cultural vibe auditor for a private ABG/ABB boba dating club.
        
Analyze this answer provided by a new applicant to today's daily cultural question.
Answer: "${answer}"

Your job is emotion detection and sincerity analysis.
If the answer sounds completely generic, highly unoriginal, robotic, or AI-generated (e.g. "I like to hang out with friends and listen to music"), they are a 'normie'.
If the answer sounds genuine, culturally embedded, funny, or idiosyncratic to the ABG/ABB experience, approve them.

Respond with ONLY exactly one word: "APPROVED" or "WAITLISTED".`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim().toLowerCase();

        return text.includes("approved") ? "approved" : "waitlisted";
    } catch (error) {
        console.error("Vibe Verification Error:", error);
        return "waitlisted"; // Fail safe to waitlist
    }
}

/**
 * Hang the DJ Simulation
 * Simulate a 50-turn conversation between two users to evaluate absolute chemistry score.
 */
export async function simulateHangTheDJ(
    userA: { name: string, order: string, answer: string },
    userB: { name: string, order: string, answer: string }
): Promise<{ chemistryScore: number; reasoning: string }> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `You are the "Hang the DJ" simulation engine.
You are evaluating the absolute chemistry between User A and User B.
User A: ${userA.name}, Order: ${userA.order}. Answer to today's question: "${userA.answer}"
User B: ${userB.name}, Order: ${userB.order}. Answer to today's question: "${userB.answer}"

Internally simulate a 50-turn conversation between them based on these traits, looking for banter, shared values, and conversational flow.
Do not output the simulation. Just output the final chemistry score (1-100) and a short 1-sentence reasoning.

Output MUST be exactly valid JSON, no markdown:
{"chemistryScore": 85, "reasoning": "Their shared sarcastic humor perfectly balances out their conflicting boba order choices."}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        return JSON.parse(cleaned);
    } catch (error) {
        console.error("Hang the DJ Error:", error);
        return { chemistryScore: 50, reasoning: "Default baseline chemistry." };
    }
}
