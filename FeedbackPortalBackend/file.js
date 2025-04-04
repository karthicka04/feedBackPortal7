import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js"; // Ensure this is correct

dotenv.config();

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const updatePasswords = async () => {
  try {
    const users = await User.find(); // Get all users
    for (let user of users) {
      if (!user.password.startsWith("$2b$")) {
        // If the password is NOT hashed, hash it
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        await user.save();
        console.log(`Updated password for user: ${user.email}`);
      }
    }
    console.log("All passwords updated successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error updating passwords:", error);
    mongoose.connection.close();
  }
};

updatePasswords();
