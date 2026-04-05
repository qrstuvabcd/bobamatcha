import { Resend } from "resend";

let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
}

export async function sendMatchEmail(
    toEmail: string,
    partnerInstagram: string,
    chemistryReasoning: string
) {
    console.log(`[MAILER] Dispatching match to ${toEmail} with IG: @${partnerInstagram}`);

    if (!resend) {
        console.warn("[MAILER WARNING] No RESEND_API_KEY. Simulated email payload:", { toEmail, partnerInstagram, chemistryReasoning });
        return true;
    }

    try {
        const fromEmail = process.env.MATCH_FROM_EMAIL || "BobaMatcha <hello@bobamatcha.xyz>";
        await resend.emails.send({
            from: fromEmail, 
            to: [toEmail],
            subject: "Your Daily Boba Match is Here! 🧋",
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #FFF4E6; color: #5C4033; padding: 40px; border-radius: 20px; max-width: 600px; margin: auto; border: 4px solid #5C4033; text-align: center;">
                    <span style="font-size: 50px;">🍵</span>
                    <h1 style="color: #A4C639; margin-bottom: 5px;">It's a Matcha!</h1>
                    <p style="font-size: 16px; margin-top: 0;">We found your daily Boba date.</p>
                    
                    <div style="background-color: white; padding: 30px; border-radius: 12px; border: 2px solid #5C4033; margin: 30px 0;">
                        <p style="margin: 0; font-size: 12px; text-transform: uppercase; color: #A4C639; font-weight: bold; letter-spacing: 1px;">Partner's Instagram</p>
                        <h2 style="font-size: 28px; margin: 10px 0;">
                            <a href="https://instagram.com/${partnerInstagram}" style="color: #6b4226; text-decoration: none;">@${partnerInstagram}</a>
                        </h2>
                        
                        <hr style="border: 1px dashed #f0e0cc; margin: 20px 0;" />
                        
                        <p style="margin: 0; font-size: 12px; text-transform: uppercase; color: #A4C639; font-weight: bold; letter-spacing: 1px;">The Connoisseur's Notes</p>
                        <p style="font-style: italic; font-size: 14px; opacity: 0.8; margin-top: 10px;">"${chemistryReasoning}"</p>
                    </div>

                    <a href="https://instagram.com/${partnerInstagram}" style="display: inline-block; background-color: #A4C639; color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; border: 2px solid #5C4033; border-bottom-width: 4px;">Slide in the DMs →</a>

                    <p style="font-size: 11px; margin-top: 30px; opacity: 0.5;">
                        You received this because you participated in the BobaMatcha Daily Drop.
                    </p>
                </div>
            `
        });
        return true;
    } catch (error) {
        console.error("[MAILER ERROR]", error);
        return false;
    }
}
