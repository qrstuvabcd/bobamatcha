import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, gender, favorite_order, instagram, city } = body;

        if (!name || !email || !gender || !city) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

        // Store user (Status is pending by default, Vibe Check happens on their first answer submission)
        const { data: user, error } = await supabase
            .from("users")
            .insert({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                gender,
                favorite_order: favorite_order?.trim() || null,
                instagram: instagram?.trim() || null,
                city: city.trim().toLowerCase(),
                status: "pending"
            })
            .select()
            .single();

        if (error) {
            console.error("Signup DB error:", error);
            return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
        }

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
