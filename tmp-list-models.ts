import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function listModels() {
    try {
        console.log("Listing models...");
        // In the latest SDK, there isn't a direct listModels on genAI, 
        // usually we just try a model or use the REST API.
        // However, we can try to initialize some common names.
        
        const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-2.0-flash-exp"];
        
        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hi");
                console.log(`Model ${modelName}: SUCCESS`);
            } catch (err: any) {
                console.log(`Model ${modelName}: FAILED (${err.status || 'Error'})`);
                if (err.message) console.log(`   Message: ${err.message}`);
            }
        }
    } catch (err) {
        console.error("List models failed:", err);
    }
}

listModels();
