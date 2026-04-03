import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserStatus = "pending" | "approved" | "waitlisted";

export interface User {
    id: string;
    email: string;
    gender: "male" | "female";
    instagram: string;
    created_at: string;
}

export interface DailyQuestion {
    id: string;
    question_text: string;
    question_date: string;
    created_at: string;
}

export interface DailyAnswer {
    id: string;
    user_id: string;
    question_id: string;
    answer_text: string;
    answer_date: string;
    created_at: string;
}

export interface Match {
    id: string;
    user_a_id: string;
    user_b_id: string;
    match_reasoning: string;
    match_date: string;
    created_at: string;
}
