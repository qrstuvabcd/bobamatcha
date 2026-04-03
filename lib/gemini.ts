import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Generate a fun ABG/ABB cultural daily question.
 */
export async function generateDailyQuestion(): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `You are the AI brain for BobaMatcha, a daily boba dating app for ABGs (Asian Baby Girls) and ABBs (Asian Baby Boys).

Generate ONE fun, flirty, culturally relevant question for today's daily match drop. The question should be something that reveals personality and dating compatibility. It should be relatable to the ABG/ABB lifestyle and boba culture.

Examples of the VIBE (do NOT repeat these, make a NEW one):
- "What's your controversial boba take? (e.g., 'less ice is superior' or 'taro is overrated')"
- "You're taking someone on a first date in your city — where are you going?"
- "What's your go-to karaoke song?"
- "Hot take: pho or ramen for a late-night date?"
- "What's your love language but make it boba? (e.g., 'acts of service = ordering for you')"
- "Are you a '2 AM ramen run' person or a 'Sunday dim sum' person?"
- "What's your ideal Saturday night — clubbing, hotpot at home, or boba and a walk?"

The question should be:
- Fun and casual (not too serious)
- Reveal dating preferences or personality
- Culturally relevant to Asian-American young adults
- Short (1-2 sentences max)

Respond with ONLY the question text, nothing else.`;

        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        console.error("Gemini question generation error:", error);
        return "What's your go-to boba order and what does it say about you as a partner? 🧋";
    }
}

/**
 * Given male and female users with their answers, generate optimal cross-gender pairs.
 */
export async function generateMatchPairs(
    males: Array<{ id: string; name: string; answer: string; order: string }>,
    females: Array<{ id: string; name: string; answer: string; order: string }>,
    question: string
): Promise<Array<{ maleId: string; femaleId: string; reasoning: string }>> {
    if (males.length === 0 || females.length === 0) return [];

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `You are the AI matchmaker for BobaMatcha, a daily boba dating app for ABGs and ABBs.

Today's question was: "${question}"

Here are the MALE users and their answers:
${males.map(m => `- ID: "${m.id}" | Name: ${m.name} | Answer: "${m.answer}" | Boba order: ${m.order}`).join("\n")}

Here are the FEMALE users and their answers:
${females.map(f => `- ID: "${f.id}" | Name: ${f.name} | Answer: "${f.answer}" | Boba order: ${f.order}`).join("\n")}

Match each male with exactly ONE female based on answer compatibility, shared vibes, and complementary personalities. Each person can only be in one pair. If there are unequal numbers, some people will be unmatched.

For each pair, write a cute, short reasoning (1-2 sentences) explaining why they'd vibe together. Make it fun and flirty.

Respond ONLY with valid JSON in this exact format, no markdown:
[
  {"maleId": "...", "femaleId": "...", "reasoning": "..."},
  {"maleId": "...", "femaleId": "...", "reasoning": "..."}
]`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        return JSON.parse(cleaned);
    } catch (error) {
        console.error("Gemini matching error:", error);
        // Fallback: simple sequential pairing
        const pairs = [];
        const count = Math.min(males.length, females.length);
        for (let i = 0; i < count; i++) {
            pairs.push({
                maleId: males[i].id,
                femaleId: females[i].id,
                reasoning: "Two boba lovers matched by fate! 🧋"
            });
        }
        return pairs;
    }
}
