import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserStatus = "pending" | "approved" | "waitlisted";

export interface User {
    id: string;
    name: string;
    email: string;
    gender: "male" | "female";
    favorite_order: string;
    instagram: string;
    city: string;
    location?: string;
    q1_answer: string;
    q2_answer: string;
    q3_answer: string;
    q4_answer: string;
    q5_answer: string;
    status: UserStatus;
    bouncer_audit_result?: string;
    created_at: string;
}

export interface Match {
    id: string;
    user_a_id: string;
    user_b_id: string;
    match_reasoning: string;
    hang_the_dj_score: number;
    secret_code: string;
    venue_name: string;
    venue_address: string;
    maps_link: string;
    match_date: string;
    created_at: string;
}
