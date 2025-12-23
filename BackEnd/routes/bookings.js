import express from "express";
import multer from "multer";
import path from "path";
import Booking from "../models/Booking.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ================= CREATE BOOKING ================= */
router.post("/", upload.single("media"), async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      campaignType,
      billboardTitle,
      startDate,
      endDate,
    } = req.body;

    const booking = await Booking.create({
      userId,
      userName,
      userEmail,
      campaignType,
      billboardTitle,
      startDate,
      endDate,
      mediaUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    /* ===== ADMIN EMAIL ===== */
    await sendEmail({
      to: "ultramotionng@gmail.com",
      subject: "📢 New Campaign Booking",
      html: `
        <h2>New Booking</h2>
        <p><b>Name:</b> ${userName}</p>
        <p><b>Email:</b> ${userEmail}</p>
        <p><b>Campaign:</b> ${campaignType}</p>
      `,
    });

    /* ===== CLIENT EMAIL ===== */
    await sendEmail({
      to: userEmail,
      subject: "✅ Booking Received",
      html: `
        <h2>Thank you for your booking</h2>
        <p>Your campaign request has been received.</p>
        <p>Status: <b>Pending approval</b></p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed" });
  }
});

/* ================= ADMIN ACTIONS ================= */
router.get("/", async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json(bookings);
});

router.post("/:id/approve", async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );
  res.json(booking);
});

router.post("/:id/reject", async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );
  res.json(booking);
});

export default router;
