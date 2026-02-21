require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// 1. Health Check Route
app.get('/', (req, res) => {
    res.json({ 
        status: "Online", 
        message: "ScholarFlow Backend Engine is running!" 
    });
});

// 2. The Main Hackathon Endpoint (Dummy Response for now)
app.post('/api/evaluate', async (req, res) => {
    try {
        const { student_profile } = req.body;
        
        console.log(`📡 Received request to evaluate profile for: ${student_profile.name}`);
        console.log(`Academic Details: CGPA ${student_profile.cgpa}, Income: ₹${student_profile.annual_income}`);

        // We will replace this with the MongoDB + MegaLLM logic soon!
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