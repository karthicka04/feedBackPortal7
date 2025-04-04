import User from "../models/User.js";
import bcrypt from "bcryptjs";

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
      // ✅ Check if the user exists
      const user = await User.findOne({ email });

      if (!user) {
          console.log("❌ User not found:", email);
          return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log("✅ User found:", user.email);

      // ✅ Compare entered password with hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("🔍 Password match:", isMatch);

      if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      res.status(200).json({ 
          message: "✅ Login successful",
          user: {
              id: user._id,
              email: user.email
          }
      });

  } catch (error) {
      console.error("❌ Error during login:", error.message);
      res.status(500).json({ message: "Internal server error" });
  }
};

export default loginUser;
