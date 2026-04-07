import { generateDailyQuestion } from "./lib/gemini";

async function testGemini() {
    console.log("Testing Gemini question generation...");
    try {
        const question = await generateDailyQuestion();
        console.log("Generated Question:", question);
        
        if (question === "What's your go-to boba order and what does it say about you as a partner? 🧋") {
            console.log("WARNING: Received FALLBACK question. The API call likely FAILED.");
        } else {
            console.log("SUCCESS: Received dynamic question from Gemini.");
        }
    } catch (err) {
        console.error("Test script caught error:", err);
    }
}

testGemini();
