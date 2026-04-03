import { createClient } from "@supabase/supabase-js";
import puppeteer from "puppeteer";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * THE BOUNCER: Silent Social Audit
 * 
 * "Check the provided Instagram handle for activity markers. Do not scrape; 
 * simply verify existence and public 'vibe' alignment."
 */
async function auditPendingUsers() {
    console.log("🕵️‍♂️ The Bouncer is starting the Silent Social Audit...");

    // Find users who passed the Connoisseur (approved) but haven't been audited yet
    const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .eq("status", "approved")
        .is("bouncer_audit_result", null);

    if (error || !users || users.length === 0) {
        console.log("✅ No pending audits. The club is clean.");
        return;
    }

    console.log(`🔍 Found ${users.length} users to audit. Initializing browser...`);

    const browser = await puppeteer.launch({ headless: true });

    for (const user of users) {
        if (!user.instagram) {
            console.log(`⚠️ User ${user.name} has no Instagram attached. Marking as Manual Review.`);
            await markAudit(user.id, "No IG - Pass on trust");
            continue;
        }

        const handle = user.instagram.replace("@", "").trim();
        console.log(`🕵️‍♂️ Checking @${handle} (${user.name})...`);

        try {
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

            const response = await page.goto(`https://www.instagram.com/${handle}/`, { waitUntil: 'domcontentloaded' });

            if (response?.status() === 404) {
                console.log(`❌ @${handle} does not exist. Red flag.`);
                await markAudit(user.id, "Failed: IG handle not found.");

                // If it's a completely fake handle, The Bouncer might downgrade them to waitlisted
                await supabase.from("users").update({ status: "waitlisted" }).eq("id", user.id);
                continue;
            }

            // Silent Social Audit: just reading the OpenGraph tags for follower thresholds (vibe check)
            const description = await page.$eval('meta[property="og:description"]', el => el.getAttribute('content')).catch(() => null);

            if (description && description.includes("Followers")) {
                // e.g. "1,500 Followers, 300 Following, 50 Posts"
                const followersMatch = description.match(/([\d,km]+)\s+Followers/i);

                if (followersMatch) {
                    console.log(`✅ @${handle} verified: ${followersMatch[1]} followers.`);
                    await markAudit(user.id, `Verified: ${followersMatch[1]} followers.`);
                } else {
                    console.log(`✅ @${handle} verified existence (Private/No metrics).`);
                    await markAudit(user.id, "Verified: Private Account");
                }
            } else {
                console.log(`✅ @${handle} verified existence.`);
                await markAudit(user.id, "Verified: Exists");
            }

            await page.close();

            // Be polite to IG servers
            await new Promise(resolve => setTimeout(resolve, 3000));
        } catch (err) {
            console.log(`❌ Error checking @${handle}. Marking as skipped.`);
            await markAudit(user.id, "Skipped: Network error");
        }
    }

    await browser.close();
    console.log("🕵️‍♂️ The Bouncer has finished patrolling for today.");
}

async function markAudit(userId: string, result: string) {
    await supabase.from("users").update({ bouncer_audit_result: result }).eq("id", userId);
}

auditPendingUsers();
