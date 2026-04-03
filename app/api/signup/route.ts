import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyVibeSincerity } from "@/lib/connoisseur";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, gender, favorite_order, instagram, city, answers } = body;

        if (!name || !email || !gender || !city || !answers || answers.length !== 5) {
            return NextResponse.json({ error: "Missing required fields or 5 answers" }, { status: 400 });
        }

        // Check if email already exists
        const { data: existing } = await supabase
            .from("users")
            .select("id, status")
            .eq("email", email)
            .single();

        if (existing) {
            return NextResponse.json({ error: "Email already registered", status: existing.status, userId: existing.id }, { status: 409 });
        }

        // AGENT: THE CONNOISSEUR
        // Run Vibe Check Sincerity Analysis
        const status = await verifyVibeSincerity(answers);

        // Store user
        const { data: user, error } = await supabase
            .from("users")
            .insert({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                gender,
                favorite_order: favorite_order?.trim() || null,
                instagram: instagram?.trim() || null,
                city: city.trim().toLowerCase(),
                q1_answer: answers[0],
                q2_answer: answers[1],
                q3_answer: answers[2],
                q4_answer: answers[3],
                q5_answer: answers[4],
                status: status
            })
            .select()
            .single();

        if (error) {
            console.error("Signup DB error:", error);
            return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
        }

        // The Bouncer will asynchronously audit the IG handle if provided 
        // (Handled via background jobs in production, synchronously simulated if needed)

        return NextResponse.json({ success: true, status, user });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
