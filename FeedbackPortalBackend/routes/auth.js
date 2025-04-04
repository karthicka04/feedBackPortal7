import mongoose from "mongoose";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", async (req, res) => {
  console.log("Login request received:", req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found!");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      console.log("User found:", user);

      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          registerNo: user.registerNo,
          department: user.department,
          batch: user.batch,
          _id: user._id,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      const temp = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        registerNo: user.registerNo,
        department: user.department,
        batch: user.batch,
        token: token,
      };
      return res.send(temp);
    } else {
      console.log("Invalid password!");
      return res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const UserId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(UserId)) {
      return res.status(400).json({ error: "Invalid userId: Not a valid ObjectId." });
    }

    const { name, email, registerNo, department, batch, password } = req.body;

    // Find the user first
    const user = await User.findById(UserId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the password if a new one is provided
    let hashedPassword = user.password; // Keep the existing password if not changed

    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update the user document
    user.name = name;
    user.email = email;
    user.registerNo = registerNo;
    user.department = department;
    user.batch = batch;
    user.password = hashedPassword;

    // Save the updated user
    const updatedUser = await user.save();

    console.log("Profile updated successfully:", updatedUser);
    res.status(200).json({ message: "Profile updated successfully!", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ error: "Failed to update profile.", details: error.message, stack: error.stack });
  }
});

export default router;