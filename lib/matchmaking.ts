import { supabase, User } from "./supabase";
import { sendWhatsAppMessage } from "./whatsapp";

/**
 * Find other available users within a radius (default 5km ≈ 3 miles).
 */
export async function findNearbyAvailableUsers(
    phone: string,
    radiusMeters: number = 5000
): Promise<User[]> {
    // Get the requesting user's location first
    const { data: currentUser } = await supabase
        .from("users")
        .select("*")
        .eq("phone_number", phone)
        .single();

    if (!currentUser?.location) return [];

    // PostGIS query: find available users within radius
    const { data: nearbyUsers, error } = await supabase.rpc(
        "find_nearby_available_users",
        {
            user_phone: phone,
            radius_meters: radiusMeters,
        }
    );

    if (error) {
        console.error("Nearby users query error:", error);
        return [];
    }

    return nearbyUsers || [];
}

/**
 * Ping idle (non-available) users near the requesting user.
 * Sends them a WhatsApp message asking if they want to join a boba run.
 */
export async function pingIdleUsers(
    requestingPhone: string,
    timePreference: string = "now",
    radiusMeters: number = 5000
): Promise<void> {
    const { data: requestingUser } = await supabase
        .from("users")
        .select("*")
        .eq("phone_number", requestingPhone)
        .single();

    if (!requestingUser) return;

    // Find idle users nearby
    const { data: idleUsers, error } = await supabase.rpc(
        "find_nearby_idle_users",
        {
            user_phone: requestingPhone,
            radius_meters: radiusMeters,
        }
    );

    if (error) {
        console.error("Idle users query error:", error);
        return;
    }

    if (!idleUsers || idleUsers.length === 0) return;

    // Send push notifications to idle users
    const timeText =
        timePreference === "now" ? "right now" : `in ${timePreference}`;

    for (const user of idleUsers) {
        await sendWhatsAppMessage(
            user.phone_number,
            `🧋 Someone nearby is going on a boba run ${timeText}. Want to join?\n\nReply "I'm in!" to get matched.`
        );
    }
}

/**
 * Calculate the geographic midpoint between two lat/lng pairs.
 */
export function calculateMidpoint(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): { lat: number; lng: number } {
    // Convert to radians
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const lng1Rad = (lng1 * Math.PI) / 180;

    const bx = Math.cos(lat2Rad) * Math.cos(dLng);
    const by = Math.cos(lat2Rad) * Math.sin(dLng);

    const midLat = Math.atan2(
        Math.sin(lat1Rad) + Math.sin(lat2Rad),
        Math.sqrt((Math.cos(lat1Rad) + bx) ** 2 + by ** 2)
    );
    const midLng = lng1Rad + Math.atan2(by, Math.cos(lat1Rad) + bx);

    return {
        lat: (midLat * 180) / Math.PI,
        lng: (midLng * 180) / Math.PI,
    };
}
