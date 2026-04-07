import { supabase } from "./lib/supabase.ts";

async function checkQuestions() {
    console.log("Checking daily questions...");
    const { data, error } = await supabase
        .from("daily_questions")
        .select("*")
        .order("question_date", { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching questions:", error);
        return;
    }

    console.log("Last 5 questions:");
    console.log(JSON.stringify(data, null, 2));
}

checkQuestions();
