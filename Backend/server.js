require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { OpenAI } = require('openai');

// 1. Initialize the MegaLLM client using the OpenAI SDK format
const megallm = new OpenAI({
    baseURL: process.env.MEGALLM_BASE_URL, 
    apiKey: process.env.MEGALLM_API_KEY
});

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
connectDB(); 
// --------------------------

// 1. Health Check Route
app.get('/', (req, res) => {
    res.json({ 
        status: "Online", 
        message: "ScholarFlow Backend Engine is running!" 
    });
});

// 2. The Main Hackathon Endpoint (SDK Powered with Credit Saver!)
app.post('/api/evaluate', async (req, res) => {
    try {
        const { student_profile } = req.body;
        console.log(`📡 Analyzing profile for: ${student_profile?.name || "Student"}`);

        // 1. Fetch the real scholarships from your local MongoDB
        const database = client.db("scholarflow");
        const scholarships = await database.collection("scholarships").find({}).toArray();

        // 🚨 CREDIT SAVER SAFETY CHECK 🚨
        // This prevents wasting AI credits if the database is empty
        if (!scholarships || scholarships.length === 0) {
            console.warn("⚠️ No scholarships found in database. Skipping AI call to save credits.");
            return res.status(404).json({ 
                error: "Database Empty", 
                message: "No scholarships found. Please import data into your MongoDB collection first." 
            });
        }

        // 2. Prepare the "Reasoning" Prompt
        const prompt = `
            You are the ScholarFlow Eligibility Engine. 
            Student Profile: ${JSON.stringify(student_profile)}
            Available Scholarships: ${JSON.stringify(scholarships)}

            Task: Return ONLY a valid JSON object (no markdown) with these exact keys:
            - "status": "eligible" or "not_eligible"
            - "scholarship_name": The name of the best matching scholarship
            - "eligibility_proof": A short explanation of why they qualify based on the rules
            - "funding_amount": The value from the 'Funding' field
        `;

        console.log("🧠 Asking MegaLLM for a decision...");

        // 3. Call MegaLLM using gemini-2.5-flash (Safe for Free Tier)
        const response = await megallm.chat.completions.create({
            model: "gemini-2.5-flash", 
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
            response_format: { type: "json_object" } 
        });

        // 🚨 DEBUGGING BLOCK 🚨
        console.log("🔍 Raw API Response from MegaLLM:", JSON.stringify(response, null, 2));

        // 4. Extract and parse the decision
        const aiText = response.choices[0].message.content;
        const aiDecision = JSON.parse(aiText);
        
        res.json(aiDecision);

    } catch (error) {
        console.error("❌ AI Evaluation failed:", error);
        res.status(500).json({ 
            error: "The AI is thinking too hard.",
            details: error.message 
        });
    }
});

// Test route to view scholarships in browser
app.get('/api/test-scholarships', async (req, res) => {
    try {
        const database = client.db("scholarflow");
        const collection = database.collection("scholarships");
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

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});