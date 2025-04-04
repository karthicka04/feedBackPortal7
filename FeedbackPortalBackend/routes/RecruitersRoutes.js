import express from 'express'; 
const router = express.Router();
import mongoose from 'mongoose';
import Feedback from '../models/feedback.js';
import User from '../models/User.js';
import Company from '../models/Company.js';

router.get("/", async (req, res) => {
    try {
        console.log("Fetching companies...");
        const companies = await Company.find();
        res.status(200).json(companies);
    } catch (error) {
        console.error("❌ Error fetching companies:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/company/:companyId", async (req, res) => {
    try {
        const { companyId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: "Invalid company ID" });
        }

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.status(200).json(company);
    } catch (error) {
        console.error("❌ Error fetching company:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;