import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateDailyQuestion, saveDailyQuestionToSupabase } from "@/lib/gemini";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "");

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const today = new Date().toISOString().split("T")[0];
    const { data: existing } = await supabase.from("daily_questions").select("id, question_text").eq("question_date", today).maybeSingle();
    
    let questionText = existing?.question_text;
    let questionId = existing?.id;
    
    if (!questionText) {
      questionText = await generateDailyQuestion();
      const saved = await saveDailyQuestionToSupabase(supabase, questionText);
      if (saved.success) questionId = saved.questionId;
    }
    
    return NextResponse.json({ success: true, date: today, question: questionText });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed", message: e.message }, { status: 500 });
  }
}