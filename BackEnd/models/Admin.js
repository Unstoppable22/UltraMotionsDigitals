import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import { sendEmail } from "../config/utils/sendEmail.js";
import { sendWhatsapp } from "../config/utils/sendWhatsapp.js";

const router = express.Router();

// 1. THIS IS THE LOG THAT PROVES THE DASHBOARD REACHED THE SERVER
router.use((req, res, next) => {
  if (req.method === 'PUT') {
    console.log(`📡 Incoming request: ${req.method} ${req.url}`);
  }
  next();
});

/* ================= BOOKING STATUS UPDATE ================= */
router.put("/bookings/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    console.log(`🚀 ADMIN ACTION DETECTED: Attempting to update ${bookingId} to ${status}`);

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!booking) {
      console.error("❌ DATABASE ERROR: Booking ID not found.");
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log(`✅ DB SUCCESS: "${booking.billboardTitle}" is now ${booking.status}`);

    // SEND NOTIFICATIONS
    if (booking.userEmail) {
      console.log(`📩 TRIGGERING EMAIL: To ${booking.userEmail}`);
      await sendEmail({
        to: booking.userEmail,
        subject: `Ultra Motions Update: ${status.toUpperCase()}`,
        text: `Hello ${booking.userName}, your campaign for "${booking.billboardTitle}" is now ${status.toUpperCase()}.`
      });
      console.log("✅ EMAIL DISPATCHED");
    }

    console.log(`📱 TRIGGERING WHATSAPP: To Admin`);
    await sendWhatsapp(`Status Updated! ✅\nClient: ${booking.userName}\nStatus: ${status.toUpperCase()}`);
    console.log("✅ WHATSAPP DISPATCHED");

    res.json({ success: true, booking });

  } catch (err) {
    console.error("🔥 FATAL ERROR IN ROUTE:", err.message);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

/* ================= THE REST OF YOUR ADMIN ROUTES ================= */
router.get("/bookings", async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json(bookings);
});

router.get("/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

export default router;