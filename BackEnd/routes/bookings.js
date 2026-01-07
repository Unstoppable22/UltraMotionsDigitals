import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs"; // Added for folder safety
import Booking from "../models/Booking.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ensure uploads folder exists so Multer doesn't crash
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
router.post("/", protect, upload.single("media"), async (req, res) => {
  // --- EMERGENCY LOGS ---
  console.log("--- DEBUG START ---");
  console.log("Full Headers:", req.headers.authorization ? "Present" : "MISSING");
  console.log("User Object:", req.user); 
  console.log("Body Data:", req.body);
  console.log("--- DEBUG END ---");

  try {
    // Force the values even if they are missing
    const bookingData = {
      billboardId: req.body.billboardId || `BILL-${Date.now()}`,
      userId: req.user?._id || "MANUAL-ENTRY",
      userName: req.user?.name || "Guest",
      userEmail: req.user?.email || "no-email@test.com",
      billboardTitle: req.body.billboardTitle || "Standard",
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      mediaUrl: req.file ? `/uploads/${req.file.filename}` : ""
    };

    const booking = new Booking(bookingData);
    await booking.save();
    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error("❌ SAVING ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});
export default router;