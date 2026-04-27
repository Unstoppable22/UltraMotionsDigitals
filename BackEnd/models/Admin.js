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
    if (!admin) {
      console.log(`❌ Login attempt failed: Admin ${email} not found.`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log(`❌ Login attempt failed: Incorrect password for ${email}.`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id }, 
      process.env.JWT_SECRET || "ultra_motion_secret_99", 
      { expiresIn: "1d" }
    );

    console.log(`👤 Admin logged in successfully: ${email}`);
    res.json({ success: true, token, admin: { id: admin._id, email: admin.email } });
  } catch (error) {
    console.error("🔥 Login Error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
});

/* ================= USER MANAGEMENT ================= */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    console.log(`🗑️ User deleted: ${req.params.id}`);
    res.json({ success: true, message: "User removed" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* ================= BOOKING & STATUS MANAGEMENT ================= */
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// THE LIVE SHOW: Status Updates (Approved, Running, Completed)
router.put("/bookings/:id", async (req, res) => {
  try {
    const { status } = req.body;
    console.log(`🚀 ADMIN ACTION: Attempting to update Booking ${req.params.id} to [${status}]`);

    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );

    if (!booking) {
      console.log("❌ ERROR: Booking not found in database.");
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log(`✅ DATABASE UPDATED: ${booking.billboardTitle} is now ${booking.status}`);

    // SAFETY CHECK: Ensure we have an email address
    if (booking.userEmail) {
      // 1. NOTIFY USER VIA EMAIL
      try {
        console.log(`📩 Sending status email to User: ${booking.userEmail}...`);
        await sendEmail({ 
          to: booking.userEmail, 
          subject: `Campaign Update: ${status.toUpperCase()}`, 
          text: `Hello ${booking.userName},\n\nYour campaign for "${booking.billboardTitle}" has been updated to: ${status.toUpperCase()}.\n\nLog in to your Ultra Motions dashboard to track your progress.\n\nBest regards,\nUltra Motions Team` 
        });
        console.log("✅ Email sent successfully.");
      } catch (mailErr) {
        console.error("❌ Email trigger failed:", mailErr.message);
      }
    } else {
      console.log("⚠️ SKIP EMAIL: No userEmail found for this booking.");
    }

    // 2. NOTIFY ADMIN VIA WHATSAPP
    try {
      console.log(`📱 Sending WhatsApp alert to Admin...`);
      await sendWhatsapp(`Status Updated! ✅\nBillboard: ${booking.billboardTitle}\nClient: ${booking.userName}\nNew Status: *${status.toUpperCase()}*`);
      console.log("✅ WhatsApp alert sent.");
    } catch (waErr) {
      console.error("❌ WhatsApp trigger failed:", waErr.message);
    }

    res.json({ success: true, booking });
  } catch (err) {
    console.error("🔥 FATAL ERROR IN STATUS UPDATE:", err.message);
    res.status(500).json({ message: "Status update failed", error: err.message });
  }
});

export default router;