import express from "express";
import multer from "multer";
import path from "path";
import Booking from "../models/Booking.js";
import { sendEmail } from "../utils/sendEmail.js";
import { protect } from "../middleware/authMiddleware.js"; // Middleware imported

const router = express.Router();

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/* ================= CREATE BOOKING (PROTECTED) ================= */
router.post("/", protect, upload.single("media"), async (req, res) => {
  try {
    const { campaignType, billboardTitle, startDate, endDate } = req.body;

    // We pull the user details directly from req.user (set by protect middleware)
    // This is more secure than trusting the frontend to send the ID
    const booking = await Booking.create({
      userId: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      campaignType,
      billboardTitle,
      startDate,
      endDate,
      mediaUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    /* ===== EMAILS ===== */
    // Admin Notification
    await sendEmail({
      to: "ultramotionng@gmail.com",
      subject: "📢 New Campaign Booking",
      html: `<h2>New Booking</h2>
             <p><b>Name:</b> ${req.user.name}</p>
             <p><b>Email:</b> ${req.user.email}</p>
             <p><b>Campaign:</b> ${billboardTitle}</p>`,
    });

    // Client Confirmation
    await sendEmail({
      to: req.user.email,
      subject: "✅ Booking Received",
      html: `<h2>Thank you for your booking, ${req.user.name}</h2>
             <p>Your campaign request for <b>${billboardTitle}</b> has been received.</p>
             <p>Status: <b>Pending approval</b></p>`,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
});

/* ================= ADMIN ACTIONS ================= */
router.get("/", protect, async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json(bookings);
});

router.post("/:id/approve", protect, async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );
  res.json(booking);
});

router.post("/:id/reject", protect, async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );
  res.json(booking);
});

export default router;