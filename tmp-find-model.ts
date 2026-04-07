import { GoogleGenerativeAI } from "@google/generative-ai";

const key = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(key);

const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest",
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-2.0-pro-exp-02-05",
    "gemini-pro"
];

async function findWorkingModel() {
    console.log("Searching for working model...");
    for (const m of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            await model.generateContent("test");
            console.log(`[WORKING] ${m}`);
            return m;
        } catch (err) {
            // console.log(`[FAILED] ${m}`);
        }
    }
    console.log("No working model found.");
    return null;
}

findWorkingModel();
