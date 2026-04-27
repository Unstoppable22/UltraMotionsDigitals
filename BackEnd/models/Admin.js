import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import { sendEmail } from "../config/utils/sendEmail.js";
import { sendWhatsapp } from "../config/utils/sendWhatsapp.js";

const router = express.Router();

/* ================= ADMIN AUTH ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    console.log(`👤 Admin logged in: ${email}`);
    res.json({ success: true, token, admin: { id: admin._id, email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= USER MANAGEMENT ================= */
router.get("/users", async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

router.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  console.log(`🗑️ User deleted: ${req.params.id}`);
  res.json({ success: true });
});

/* ================= BOOKING & STATUS MANAGEMENT ================= */
router.get("/bookings", async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json(bookings);
});

// THE LIVE SHOW: Status Updates
router.put("/bookings/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    console.log(`🔄 STATUS CHANGE: ${booking.billboardTitle} is now [${status.toUpperCase()}]`);

    // 1. NOTIFY USER VIA EMAIL
    try {
      console.log(`📩 Sending ${status} email to ${booking.userEmail}...`);
      await sendEmail({ 
        to: booking.userEmail, 
        subject: `Campaign Update: ${status.toUpperCase()}`, 
        text: `Hello ${booking.userName}, your campaign for "${booking.billboardTitle}" is now ${status}.` 
      });
      console.log("✅ Email sent successfully.");
    } catch (mailErr) {
      console.error("❌ Email failed:", mailErr.message);
    }

    // 2. NOTIFY ADMIN VIA WHATSAPP
    try {
      console.log(`📱 Sending WhatsApp alert to Admin...`);
      await sendWhatsapp(`Status Updated! ✅\nBillboard: ${booking.billboardTitle}\nClient: ${booking.userName}\nNew Status: *${status.toUpperCase()}*`);
      console.log("✅ WhatsApp alert sent.");
    } catch (waErr) {
      console.error("❌ WhatsApp failed:", waErr.message);
    }

    res.json(booking);
  } catch (err) {
    console.error("🔥 Status Update Crash:", err.message);
    res.status(500).json({ message: "Status update failed", error: err.message });
  }
});

export default router;