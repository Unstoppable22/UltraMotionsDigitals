import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import multer from "multer";
import path from "path";
import nodemailer from "nodemailer";
import fs from "fs"; // Added to handle directory creation
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ✅ Ensure uploads directory exists on start
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ------------------------------
// Multer storage (Fixed for Render)
// ------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Use a unique timestamp/random combo since req.user isn't available yet
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, "profile_" + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// ------------------------------
// SIGNUP (Already good)
// ------------------------------
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, name, email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

// ------------------------------
// LOGIN (Already good)
// ------------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// ------------------------------
// PHOTO UPLOAD (Logic Fixed)
// ------------------------------
// NOTE: Protect must come BEFORE upload.single if you want to use req.user inside the filename logic,
// BUT Multer usually parses the body first. This order works best:
router.post("/profile/photo", protect, upload.single("profilePhoto"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePhoto = req.file.filename;
    await user.save();

    res.json({ message: "Profile photo updated", profilePhoto: user.profilePhoto });
  } catch (error) {
    res.status(500).json({ message: "Photo upload failed", error: error.message });
  }
});

// ... (Keep the rest of your routes as they were)
export default router;