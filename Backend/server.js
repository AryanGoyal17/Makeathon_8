require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// --- MONGODB CONNECTION ---
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log("🟢 Successfully connected to MongoDB Atlas!");
    } catch (error) {
        console.error("🔴 Failed to connect to MongoDB:", error);
    }
}
connectDB(); // Run the connection function
// --------------------------

// 1. Health Check Route
app.get('/', (req, res) => {
    res.json({ 
        status: "Online", 
        message: "ScholarFlow Backend Engine is running!" 
    });
});

// 2. The Main Hackathon Endpoint (AI Powered!)
app.post('/api/evaluate', async (req, res) => {
    try {
        const { student_profile } = req.body;
        console.log(`📡 Analyzing profile for: ${student_profile?.name || "Student"}`);

        // 1. Fetch the real scholarships from your local MongoDB
        const database = client.db("scholarflow");
        const scholarships = await database.collection("scholarships").find({}).toArray();

        // ---------------------------------------------------------
        // 🛡️ CREDIT SAVER: "DEV MODE"
        // Set to true while coding the frontend. Set to false for judges!
        const DEV_MODE = false; 
        
        if (DEV_MODE) {
            console.log("🛠️ DEV MODE ON: Returning mock data to save MegaLLM API credits.");
            return res.json({
                status: "eligible",
                scholarship_name: "Reliance Foundation Undergraduate Scholarship",
                eligibility_proof: "MOCK PROOF: Student's CGPA meets the > 7.5 requirement.",
                funding_amount: "Up to ₹2,00,000"
            });
        }
        // ---------------------------------------------------------

        // 2. Prepare the "Reasoning" Prompt for MegaLLM
        const prompt = `
            You are the ScholarFlow Eligibility Engine. 
            Student Profile: ${JSON.stringify(student_profile)}
            
            Available Scholarships: ${JSON.stringify(scholarships)}

            Task: Compare the student's CGPA, Income, and details against the 'Rules' for each scholarship. 
            Return ONLY a valid JSON object (no markdown formatting, no extra text) with these exact keys:
            - "status": "eligible" or "not_eligible"
            - "scholarship_name": The name of the best matching scholarship
            - "eligibility_proof": A short explanation of why they qualify based on the rules
            - "funding_amount": The value from the 'Funding' field
        `;

        // 3. Call the MegaLLM API using native fetch
        console.log("🧠 Asking MegaLLM for a decision...");
        const aiResponse = await fetch("https://ai.megallm.io/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.MEGALLM_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // <-- Updated to a real model name!
                messages: [{ role: "user", content: prompt }],
                temperature: 0.1 
            })
        });

        const result = await aiResponse.json();
        
        // 🚨 DEBUGGING & SAFETY BLOCK 🚨
        console.log("🔍 Raw API Response from MegaLLM:", JSON.stringify(result, null, 2));

        if (!result.choices || !result.choices[0]) {
            console.error("❌ MegaLLM returned an error instead of a choice!");
            return res.status(400).json({ 
                error: "API Error", 
                details: result 
            });
        }
        // 🚨 END DEBUGGING BLOCK 🚨
        
        // 4. Clean up the AI's response to ensure it is valid JSON
        let aiText = result.choices[0].message.content;
        if (aiText.startsWith("\`\`\`json")) {
            aiText = aiText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
        }

        const aiDecision = JSON.parse(aiText);
        res.json(aiDecision);

    } catch (error) {
        console.error("❌ AI Evaluation failed:", error);
        res.status(500).json({ error: "The AI is thinking too hard. Check terminal for errors." });
    }
});

// This route will show your 10 scholarships in the browser
app.get('/api/test-scholarships', async (req, res) => {
    try {
        const database = client.db("scholarflow");
        const collection = database.collection("scholarships");
        
        // This finds all 10 documents you just imported
        const allScholarships = await collection.find({}).toArray();
        
        res.json({
            status: "Connected!",
            count: allScholarships.length,
            data: allScholarships
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});