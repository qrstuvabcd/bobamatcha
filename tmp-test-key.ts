import { GoogleGenerativeAI } from "@google/generative-ai";

const key = process.env.GEMINI_API_KEY || "";
console.log(`Using key: ${key.substring(0, 5)}...${key.substring(key.length - 3)} (length: ${key.length})`);

const genAI = new GoogleGenerativeAI(key);

async function testSimple() {
    try {
        // Try gemini-1.5-flash which is standard
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say 'hello'");
        console.log("Success:", result.response.text());
    } catch (err: any) {
        console.error("Error:", err.status, err.message);
        if (err.response) {
            console.error("Full error:", JSON.stringify(err.response, null, 2));
        }
    }
}

testSimple();
