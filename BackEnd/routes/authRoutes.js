import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { signup, login } from "../config/controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, "profile_" + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// --- AUTH ROUTES ---
router.post("/signup", signup);
router.post("/login", login);

// ✅ ADDED: GET USER PROFILE (This fixes your 404 error)
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// --- PROFILE PHOTO UPLOAD ---
router.post("/profile/photo", protect, upload.single("profilePhoto"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePhoto = req.file.filename;
    await user.save();

    res.json({ success: true, message: "Profile photo updated", profilePhoto: user.profilePhoto });
  } catch (error) {
    res.status(500).json({ message: "Photo upload failed", error: error.message });
  }
});

export default router;