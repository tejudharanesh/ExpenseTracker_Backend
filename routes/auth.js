import express from "express";
import pkg from "bcryptjs";
import pkg1 from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const { genSalt, hash, compare } = pkg;
const { sign } = pkg1;
// Register
router.post("/register", async (req, res) => {
  try {
    const { name, mobile, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ mobile });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    // Create user
    user = new User({
      name,
      mobile,
      password: hashedPassword,
    });

    await user.save();

    // Create token
    const token = sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, mobile: user.mobile },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, mobile: user.mobile },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({ id: user._id, name: user.name, mobile: user.mobile });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

//logout
router.post("/logout", auth, async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
