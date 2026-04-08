import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const QUESTION_BANK = [
  "What's your controversial boba take?",
  "You're taking someone on a first date ??where are you going?",
  "What's your go-to karaoke song?",
  "Hot take: pho or ramen for a late-night date?",
  "What's your love language but make it boba?",
];

export async function generateDailyQuestion(): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Generate ONE fun boba dating question for Asian students in UK. Under 20 words. Output only the question.";
    const result = await model.generateContent(prompt);
    const question = result.response.text().trim();
    if (question && question.length < 200) return question;
  } catch (e) {
    console.error("AI failed, using fallback");
  }
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return QUESTION_BANK[dayIndex % QUESTION_BANK.length];
}

export async function saveDailyQuestionToSupabase(supabase: any, questionText: string) {
  const today = new Date().toISOString().split("T")[0];
  const { data: existing } = await supabase.from("daily_questions").select("id").eq("question_date", today).maybeSingle();
  if (existing?.id) return { success: true, questionId: existing.id };
  const { data, error } = await supabase.from("daily_questions").insert({ question_text: questionText, question_date: today }).select("id").single();
  if (error) return { success: false, error: error.message };
  return { success: true, questionId: data?.id };
}

// Backward compatibility stubs
export async function generateAiBobaAnswer() { return "Share your answer when you meet!"; }
export async function generateMatchPairs() { return []; }