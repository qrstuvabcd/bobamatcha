import { NextResponse } from "next/server";
import { runDailyMatchmaking } from "@/lib/brain";

export async function GET() {
    try {
        console.log("Triggering daily matchmaking...");
        await runDailyMatchmaking();
        return NextResponse.json({ success: true, message: "Matchmaking completed successfully" });
    } catch (error) {
        console.error("Cron failed:", error);
        return NextResponse.json({ success: false, error: "Matchmaking failed" }, { status: 500 });
    }
}
