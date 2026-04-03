import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

/**
 * Lazy-initialized Supabase client with service role key.
 * Only creates the client when first accessed (not at import/build time).
 */
export function getSupabase(): SupabaseClient {
    if (!_supabase) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error(
                "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
            );
        }

        _supabase = createClient(supabaseUrl, supabaseServiceKey);
    }
    return _supabase;
}

// Convenience alias — use this in all lib files
export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
    },
});

// ── Types ──

export type OnboardingStep =
    | "awaiting_name"
    | "awaiting_order"
    | "awaiting_location"
    | "complete";

export type RunStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface User {
    phone_number: string;
    name: string | null;
    favorite_order: string | null;
    location: unknown; // PostGIS geography
    availability_status: boolean;
    onboarding_step: OnboardingStep;
    created_at: string;
}

export interface BobaRun {
    id: string;
    user_a_phone: string;
    user_b_phone: string;
    venue_name: string | null;
    venue_address: string | null;
    maps_link: string | null;
    meetup_time: string | null;
    status: RunStatus;
    created_at: string;
}
