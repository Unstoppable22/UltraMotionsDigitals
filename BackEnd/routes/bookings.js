import express from "express";
import multer from "multer";
import path from "path";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer Setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// THE FIX IS HERE
router.post("/", protect, upload.single("media"), async (req, res) => {
  try {
    const { billboardTitle, startDate, endDate, campaignType } = req.body;

    // 1. Debug Log: See exactly what we have before saving
    console.log("🔍 Pre-Save Check:");
    console.log("User:", req.user); // Should show _id, name, email
    console.log("Billboard:", billboardTitle);

    if (!req.user) {
      return res.status(401).json({ message: "User authentication missing" });
    }

    // 2. Generate the ID manually
    const generatedBillboardId = `BILL-${Date.now()}`;

    // 3. Construct the object carefully
    const bookingData = {
      billboardId: generatedBillboardId, // Fixes "billboardId is required"
      userId: req.user._id,             // Fixes "userId is required"
      userName: req.user.name,          // Fixes "userName is required"
      userEmail: req.user.email,
      userPhone: req.user.phone || "N/A",
      billboardTitle: billboardTitle || "Standard Campaign",
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      campaignType: campaignType || "General",
      mediaUrl: req.file ? `/uploads/${req.file.filename}` : "",
      agreed: true,
      status: "pending"
    };

    console.log("📝 Attempting to create Booking with:", bookingData);

    const booking = await Booking.create(bookingData);
    
    console.log("✅ Booking Saved:", booking._id);
    res.status(201).json({ success: true, booking });

  } catch (error) {
    console.error("🔥 FINAL DB ERROR:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Database Validation Failed", 
      error: error.message 
    });
  }
});

export default router;