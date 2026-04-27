import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import { sendEmail } from "../config/utils/sendEmail.js";
import { sendWhatsapp } from "../config/utils/sendWhatsapp.js";

const router = express.Router();

// middleware to log all admin PUT requests
router.use((req, res, next) => {
  if (req.method === 'PUT') {
    console.log(`📡 Incoming Admin Update: ${req.method} ${req.url}`);
  }
  next();
});

/* ================= BOOKING STATUS UPDATE (Live Show) ================= */
router.put("/bookings/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    console.log(`🚀 ADMIN ACTION DETECTED: Attempting to update Booking [${bookingId}] to status: [${status.toUpperCase()}]`);

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!booking) {
      console.error("❌ DATABASE ERROR: Booking ID not found.");
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log(`✅ DB SUCCESS: Billboard "${booking.billboardTitle}" updated to ${booking.status}`);

    // --- DYNAMIC EMAIL CONTENT BASED ON STATUS ---
    let emailSubject = `Ultra Motions: Campaign ${status.toUpperCase()}`;
    let emailMessage = "";

    if (status.toLowerCase() === "approved") {
      emailMessage = `Hello ${booking.userName}, great news! Your campaign for "${booking.billboardTitle}" has been approved. We are now preparing for deployment.`;
    } else if (status.toLowerCase() === "running") {
      emailMessage = `Hello ${booking.userName}, your campaign for "${booking.billboardTitle}" is now LIVE and running! 🚀`;
    } else if (status.toLowerCase() === "completed") {
      emailMessage = `Hello ${booking.userName}, your campaign for "${booking.billboardTitle}" has been successfully completed. Thank you for choosing Ultra Motion Digitals! 🏁`;
    } else {
      emailMessage = `Hello ${booking.userName}, your campaign status for "${booking.billboardTitle}" has been updated to: ${status.toUpperCase()}.`;
    }

    // --- TRIGGER EMAIL NOTIFICATION ---
    if (booking.userEmail) {
      console.log(`📩 TRIGGERING EMAIL: Sending [${status}] update to ${booking.userEmail}`);
      try {
        await sendEmail({
          to: booking.userEmail,
          subject: emailSubject,
          text: emailMessage
        });
        console.log("✅ EMAIL REFLECTED ON USER SIDE");
      } catch (mailErr) {
        console.error("❌ EMAIL REFLECTION FAILED:", mailErr.message);
      }
    } else {
      console.log("⚠️ SKIP EMAIL: No userEmail found for this booking.");
    }

    // --- TRIGGER WHATSAPP ALERT ---
    try {
      console.log(`📱 TRIGGERING WHATSAPP: Sending [${status}] update to Admin`);
      await sendWhatsapp(`Status Updated! ✅\nBillboard: ${booking.billboardTitle}\nClient: ${booking.userName}\nStatus: *${status.toUpperCase()}*`);
      console.log("✅ WHATSAPP ALERT SENT");
    } catch (waErr) {
      console.error("❌ WHATSAPP ALERT FAILED:", waErr.message);
    }

    res.json({ success: true, booking });

  } catch (err) {
    console.error("🔥 FATAL ERROR IN ADMIN ROUTE:", err.message);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

/* ================= THE REST OF YOUR ADMIN ROUTES ================= */
router.get("/bookings", async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json(bookings);
});

router.get("/users", async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

export default router;