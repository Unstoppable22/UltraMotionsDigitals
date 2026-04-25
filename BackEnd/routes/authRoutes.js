import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { signup, login, getProfile, updateProfile, updateProfilePhoto } from "../config/controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- MULTER SETUP ---
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
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

// --- PROFILE ROUTES ---

// GET: Fetch user data
router.get("/profile", protect, getProfile);

// PUT: Update user name/email (This fixes your "Cannot PUT" error)
router.put("/profile", protect, updateProfile);

// POST: Update profile photo
router.post("/profile/photo", protect, upload.single("profilePhoto"), updateProfilePhoto);

export default router;