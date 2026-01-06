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
  try {
    console.log("🔍 [DEBUG] User from Auth:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "Auth failed: No user found" });
    }

    const newBooking = new Booking({
      billboardId: `BILL-${Date.now()}`,
      userId: req.user._id?.toString() || req.user.id?.toString(),
      userName: req.user.name || "Valued Client",
      userEmail: req.user.email,
      userPhone: req.user.phone || "N/A",
      billboardTitle: req.body.billboardTitle || "Standard Billboard",
      startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
      endDate: req.body.endDate ? new Date(req.body.endDate) : new Date(),
      campaignType: req.body.campaignType || "Standard",
      mediaUrl: req.file ? `/uploads/${req.file.filename}` : "",
      agreed: true
    });

    const savedBooking = await newBooking.save();
    console.log("✅ [SUCCESS] Booking ID:", savedBooking._id);
    
    res.status(201).json({
      success: true,
      booking: savedBooking
    });

  } catch (error) {
    console.error("🔥 [SERVER ERROR]:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router;