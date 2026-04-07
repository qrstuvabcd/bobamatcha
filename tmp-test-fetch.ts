async function testFetch() {
    const key = process.env.GEMINI_API_KEY || "";
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`;
    
    console.log("Testing with fetch (v1)...");
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Say hello" }] }]
            })
        });
        
        const data = await response.json();
        console.log("Response Status:", response.status);
        console.log("Response Body:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

testFetch();
