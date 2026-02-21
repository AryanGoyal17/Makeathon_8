require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb'); // <-- We added this!

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

// 2. The Main Hackathon Endpoint (Still Dummy Data for now)
app.post('/api/evaluate', async (req, res) => {
    try {
        const { student_profile } = req.body;
        
        console.log(`📡 Received request to evaluate profile for: ${student_profile.name}`);

        res.json({
            status: "eligible",
            scholarship_name: "Post-Matric Scholarship Scheme",
            eligibility_proof: "Under Section 4.2 of the mandate, the student qualifies because their annual family income is under ₹3,50,000 and CGPA is > 8.0.",
            funding_amount: "₹85,000/year",
            next_steps: "Verify Aadhar and institution details on the NSP Portal."
        });

    } catch (error) {
        console.error("❌ Error evaluating profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});