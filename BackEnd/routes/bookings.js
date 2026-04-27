import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/authMiddleware.js";
import { sendEmail } from "../config/utils/sendEmail.js";
import { sendWhatsapp } from "../config/utils/sendWhatsapp.js";

const router = express.Router();

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

// CREATE NEW BOOKING
router.post("/", protect, upload.single("media"), async (req, res) => {
  try {
    console.log(`🆕 NEW BOOKING ATTEMPT: User ${req.user.email} is booking a billboard.`);

    const bookingData = {
      billboardId: req.body.billboardId || `BILL-${Date.now()}`,
      userId: req.user._id,
      userName: req.user.name || `${req.user.firstName} ${req.user.lastName}`,
      userEmail: req.user.email,
      billboardTitle: req.body.billboardTitle || "Unnamed",
      campaignType: req.body.campaignType || "Standard",
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      mediaUrl: req.file ? `/uploads/${req.file.filename}` : "",
      status: "pending",
      agreed: true
    };

    const booking = new Booking(bookingData);
    await booking.save();
    
    console.log(`✅ BOOKING SAVED: ID ${booking._id}`);

    // LIVE NOTIFICATIONS
    // 1. Email to User
    await sendEmail({
      to: booking.userEmail,
      subject: "Booking Received - Ultra Motions",
      text: `Hello ${booking.userName}, your booking for ${booking.billboardTitle} has been received and is pending approval.`
    });

    // 2. WhatsApp to Admin
    await sendWhatsapp(`New Campaign Booked! 📢\nClient: ${booking.userName}\nBillboard: ${booking.billboardTitle}\nType: ${booking.campaignType}`);

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error("🔥 BOOKING ERROR:", error.message);
    res.status(500).json({ error: "Failed to save booking." });
  }
});

// GET ALL BOOKINGS FOR LOGGED IN USER
router.get("/my-bookings", protect, async (req, res) => {
  try {
    const myBookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(myBookings || []);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch history" });
  }
});

export default router;