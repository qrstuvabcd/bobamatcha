// lib/gemini.ts - BobaMatcha AI Question Generator (Production Ready)
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// 🔐 環境變數安全檢查
if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY not set, AI features will fallback to bank");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// 📚 備用問題庫（15+ 高質量問題）
const QUESTION_BANK = [
  "What's your controversial boba take? (e.g., 'less ice is superior')",
  "You're taking someone on a first date in your city — where are you going?",
  "What's your go-to karaoke song?",
  "Hot take: pho or ramen for a late-night date?",
  "What's your love language but make it boba? (e.g., 'acts of service = ordering for you')",
  "Are you a '2 AM ramen run' person or a 'Sunday dim sum' person?",
  "What's your ideal Saturday night — clubbing, hotpot at home, or boba and a walk?",
  "What's your go-to boba order and what does it say about you as a partner? 🧋",
  "We're on a boba run and need a cute photo for the gram: Are you the one setting up the perfect shot or just enjoying the moment?",
  "What's your red flag when it comes to boba orders? (e.g. '0% sugar 100% ice')",
  "If you were a boba topping, would you be classic pearls, popping boba, or jelly?",
  "What's the most adventurous food you've tried as an international student?",
  "If your study session had a soundtrack, what song would be playing right now?",
  "What's your hidden talent that would impress someone on a boba date?",
  "If you could teleport to any Asian night market right now, where would you go?",
];

// ⚙️ 重試配置
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1000;
const AI_TIMEOUT_MS = 15000;

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isValidQuestion(question: string): boolean {
  if (!question || question.trim().length === 0) return false;
  if (question.trim().length > 200) return false;
  const blockedPatterns = [
    /\b(spam|scam|click here|buy now)\b/i,
    /http[s]?:\/\//i,
    /[<>{}]/,
  ];
  return !blockedPatterns.some(pattern => pattern.test(question));
}

export async function generateDailyQuestion(): Promise<string> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is not configured");
      }
      
      const model: GenerativeModel = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 256,
          stopSequences: ["\n\n"],
        }
      });
      
      const prompt = `Generate ONE fun, flirty, and culturally-relevant dating icebreaker question for Asian international students in the UK. 

Requirements:
- Topic: boba tea, campus life, or study abroad experiences
- Length: under 20 words, concise and punchy
- Tone: playful, warm, Gen-Z friendly
- Avoid: politics, religion, sensitive topics
- Output: ONLY the question text, no quotes, no explanations

Example good outputs:
- "What's your boba order and what does it say about your dating style? 🧋"
- "If our first meet-up was a boba flavor, what would it be and why?"`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      
      clearTimeout(timeoutId);
      
      const question = result.response.text().trim();
      
      if (isValidQuestion(question)) {
        console.log(`[AI] ✅ Generated on attempt ${attempt}: "${question.substring(0, 40)}..."`);
        return question;
      } else {
        console.warn(`[AI] ⚠️ Validation failed on attempt ${attempt}: "${question}"`);
        throw new Error("Generated content failed quality validation");
      }
      
    } catch (error: any) {
      lastError = error;
      const errorMsg = error?.message || error?.toString() || 'Unknown error';
      console.error(`[AI] ❌ Attempt ${attempt}/${MAX_RETRIES} failed: ${errorMsg}`);
      
      if (attempt === MAX_RETRIES) {
        console.error(`[AI] 🔥 All retries exhausted. Final error:`, {
          name: error?.name,
          message: error?.message,
          status: error?.status,
        });
      }
      
      if (attempt < MAX_RETRIES) {
        const delayMs = BASE_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        const jitter = Math.random() * 200;
        console.log(`[AI] 🔄 Retrying in ${delayMs + jitter}ms...`);
        await delay(delayMs + jitter);
      }
    }
  }
  
  console.warn("[AI] 📦 Falling back to QUESTION_BANK");
  try {
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const fallback = QUESTION_BANK[dayIndex % QUESTION_BANK.length];
    console.log(`[AI] 🔄 Using fallback: "${fallback}"`);
    return fallback;
  } catch (fallbackError) {
    console.error("[AI] 💥 CRITICAL: Fallback also failed!", fallbackError);
    return "What's your go-to boba order and what does it say about you? 🧋";
  }
}

export async function saveDailyQuestionToSupabase(
  supabase: any,
  questionText: string,
  aiAnswer?: string
): Promise<{ success: boolean; questionId?: string; error?: string }> {
  const today = new Date().toISOString().split("T")[0];
  
  try {
    const { data: existing, error: fetchError } = await supabase
      .from("daily_questions")
      .select("id")
      .eq("question_date", today)
      .maybeSingle();
    
    if (fetchError) {
      console.error("[DB] ❌ Fetch error:", fetchError);
      return { success: false, error: fetchError.message };
    }
    
    if (existing?.id) {
      console.log(`[DB] ✅ Question for ${today} already exists (id: ${existing.id})`);
      return { success: true, questionId: existing.id };
    }
    
    const { data, error: insertError } = await supabase
      .from("daily_questions")
      .insert({
        question_text: questionText,
        ai_answer: aiAnswer || null,
        question_date: today,
      })
      .select("id")
      .single();
    
    if (insertError) {
      if (insertError.code === "23505") {
        console.log("[DB] ⚡ Concurrent insert detected, fetching existing");
        const { data: retryData, error: retryError } = await supabase
          .from("daily_questions")
          .select("id")
          .eq("question_date", today)
          .single();
        
        if (retryError) return { success: false, error: retryError.message };
        return { success: true, questionId: retryData.id };
      }
      
      console.error("[DB] ❌ Insert error:", insertError);
      return { success: false, error: insertError.message };
    }
    
    console.log(`[DB] ✅ Saved question for ${today} (id: ${data?.id})`);
    return { success: true, questionId: data?.id };
    
  } catch (error: any) {
    console.error("[DB] 💥 Unexpected error:", error);
    return { success: false, error: error.message };
  }
}
