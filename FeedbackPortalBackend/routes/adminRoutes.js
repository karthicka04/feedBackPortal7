import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import XLSX from "xlsx";
import User from "../models/User.js";
import Company from "../models/Company.js";
import Flaged from "../models/Flaged.js";
import Recruiter from "../models/Company.js";
import jwt from "jsonwebtoken"; 
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/add-user", async (req, res) => {
    try {
        const { name, email, password,registerNo,department,batch } = req.body;

      
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword ,registerNo,department,batch });
        await user.save();
        res.status(201).json({ message: "User added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// In your admin routes file
router.get("/stats", async (req, res) => {
    try {
        const totalStudents = await User.countDocuments();
        
        const departmentCounts = await User.aggregate([
            { $group: { _id: "$department", count: { $sum: 1 } } }
        ]);
        
        const deptCountsObj = {};
        departmentCounts.forEach(dept => {
            if (dept._id) {  // Add null check
                deptCountsObj[dept._id] = dept.count;
            }
        });
        
        const totalCompanies = await Recruiter.countDocuments();
        const flaggedFeedbacksCount = await Flaged.countDocuments();
        
        res.json({
            totalStudents,
            departmentCounts: deptCountsObj,
            totalCompanies,
            flaggedFeedbacksCount,
            success: true
        });
    } catch (error) {
        console.error('Stats Route Error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching statistics",
            error: error.message 
        });
    }
});


router.post("/add-company", async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).json({ message: "Company added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const upload = multer({ storage: multer.memoryStorage() });

router.post("/bulk-upload/:type", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const type = req.params.type;
        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        let data = XLSX.utils.sheet_to_json(sheet);

        if (type === "user") {
            const usersWithHashedPasswords = await Promise.all(
                data.map(async (user) => {
                    if (!user.password) {
                        throw new Error(`Missing password for user: ${user.email || "Unknown"}`);
                    }
                    return {
                        ...user,
                        password: await bcrypt.hash(user.password.toString(), 10),
                    };
                })
            );
            await User.insertMany(usersWithHashedPasswords);
        } else if (type === "company") {
            await Company.insertMany(data);
        } else {
            return res.status(400).json({ error: "Invalid type parameter" });
        }

        res.status(200).json({ message: "Bulk upload successful" });
    } catch (err) {
        console.error("Bulk upload error:", err);
        res.status(500).json({ error: "Bulk upload failed" });
    }
});


  

export default router;