/**
 * Seed script — populates the database with test users around
 * the University of Edinburgh campus and some hardcoded venues.
 *
 * Run with: npx tsx scripts/seed.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * to be set in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error(
        "❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ── Test Users around University of Edinburgh ──
// Central campus: 55.9445°N, 3.1892°W → (55.9445, -3.1892)
const testUsers = [
    {
        phone_number: "441234567001",
        name: "Alice",
        favorite_order: "Oat milk matcha latte",
        lat: 55.9448,
        lng: -3.1889, // Near George Square
        availability_status: true,
    },
    {
        phone_number: "441234567002",
        name: "Ben",
        favorite_order: "Brown sugar tiger milk tea with extra boba",
        lat: 55.9442,
        lng: -3.1868, // Near Bristo Square
        availability_status: false,
    },
    {
        phone_number: "441234567003",
        name: "Chloe",
        favorite_order: "Taro milk tea, 50% sugar, less ice",
        lat: 55.9465,
        lng: -3.19, // Near Teviot
        availability_status: true,
    },
    {
        phone_number: "441234567004",
        name: "Dan",
        favorite_order: "Jasmine green tea with aloe vera",
        lat: 55.9425,
        lng: -3.1835, // Near Pleasance
        availability_status: false,
    },
    {
        phone_number: "441234567005",
        name: "Emma",
        favorite_order: "Iced hojicha latte with oat milk",
        lat: 55.9475,
        lng: -3.1925, // Near Meadows
        availability_status: false,
    },
];

// ── Hardcoded Local Venues ──
const testVenues = [
    {
        name: "Machi Machi",
        address: "59 South Bridge, Edinburgh EH1 1LS",
        lat: 55.9488,
        lng: -3.1876,
        maps_link:
            "https://www.google.com/maps/place/Machi+Machi/@55.9488,-3.1876,17z",
    },
    {
        name: "TP Tea Edinburgh",
        address: "22 Nicolson Street, Edinburgh EH8 9DH",
        lat: 55.946,
        lng: -3.184,
        maps_link:
            "https://www.google.com/maps/place/TP+Tea/@55.946,-3.184,17z",
    },
    {
        name: "Söderberg Meadows",
        address: "1 Buccleuch Street, Edinburgh EH8 9NG",
        lat: 55.9435,
        lng: -3.1868,
        maps_link:
            "https://www.google.com/maps/place/Söderberg/@55.9435,-3.1868,17z",
    },
];

async function seed() {
    console.log("🌱 Seeding BobaMatcha database...\n");

    // Insert test users
    for (const user of testUsers) {
        const { error } = await supabase.from("users").upsert(
            {
                phone_number: user.phone_number,
                name: user.name,
                favorite_order: user.favorite_order,
                location: `POINT(${user.lng} ${user.lat})`,
                availability_status: user.availability_status,
                onboarding_step: "complete",
            },
            { onConflict: "phone_number" }
        );

        if (error) {
            console.error(`❌ Error inserting ${user.name}:`, error.message);
        } else {
            console.log(
                `✅ ${user.name} — ${user.favorite_order} — (${user.lat}, ${user.lng}) — ${user.availability_status ? "AVAILABLE" : "idle"}`
            );
        }
    }

    console.log("\n📍 Hardcoded test venues:");
    for (const venue of testVenues) {
        console.log(`   🧋 ${venue.name} — ${venue.address}`);
    }

    // Create a sample boba run between Alice and Chloe
    const { error: runError } = await supabase.from("boba_runs").insert({
        user_a_phone: "441234567001",
        user_b_phone: "441234567003",
        venue_name: "Machi Machi",
        venue_address: "59 South Bridge, Edinburgh EH1 1LS",
        maps_link:
            "https://www.google.com/maps/place/Machi+Machi/@55.9488,-3.1876,17z",
        meetup_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 mins from now
        status: "confirmed",
    });

    if (runError) {
        console.error("❌ Error creating sample boba run:", runError.message);
    } else {
        console.log(
            "\n🧋 Sample boba run created: Alice ↔ Chloe at Machi Machi (in 30 mins)"
        );
    }

    console.log("\n✨ Seeding complete!");
}

seed().catch(console.error);
