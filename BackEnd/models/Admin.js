import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendWhatsapp } from "../utils/sendWhatsapp.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
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

router.put("/users/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

router.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

/* ================= BOOKING & STATUS MANAGEMENT ================= */
router.get("/bookings", async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json(bookings);
});

// THIS IS THE MAIN LOGIC FOR STATUS NOTIFICATIONS
router.put("/bookings/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // 1. NOTIFY USER VIA EMAIL
    let subject = `Campaign Update: ${status.toUpperCase()}`;
    let body = `Hello ${booking.userName}, your billboard campaign "${booking.billboardTitle}" is now ${status}.`;

    await sendEmail({ to: booking.userEmail, subject: subject, text: body });

    // 2. NOTIFY ADMIN VIA WHATSAPP
    await sendWhatsapp(`Status Updated! ✅\nBillboard: ${booking.billboardTitle}\nClient: ${booking.userName}\nNew Status: *${status.toUpperCase()}*`);

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Status update failed", error: err.message });
  }
});

export default router;