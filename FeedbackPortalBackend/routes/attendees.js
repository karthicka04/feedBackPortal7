import express from "express";
import User from "../models/User.js";
import Attendee from "../models/Attendee.js";
import Company from "../models/Company.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/upload-attendees", async (req, res) => {
    console.log(req.body);
  try {
    const { companyId, attendees } = req.body;

    // Ensure company exists
    const company = await Company.findOne({ _id:companyId});

    if (!company) {
      return res.status(400).json({ error: "Company not found" });
    }

    for (const attendee of attendees) {
      let user = await User.findOne({ email: attendee.email });

      if (!user) {
        user = await User.create({
          name: attendee.name,
          email: attendee.email,
          registerNo: attendee.registerNo,
          department: attendee.department,
        });
      }

      await Attendee.create({ userId: user._id, companyId });
    }

    res.status(201).json({ message: "Attendees uploaded successfully" });
  } catch (error) {
    console.error("Error uploading attendees:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
