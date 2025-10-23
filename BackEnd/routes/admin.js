import express from "express";
import jwt from "jsonwebtoken";
import Booking from "../models/Booking.js"; // ✅ make sure this path is correct!

const router = express.Router();

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "123456";
const JWT_SECRET = "supersecretkey"; // move to .env later

// ✅ Admin Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "2h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// ✅ GET all bookings (Admin Dashboard)
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ message: "Server error fetching bookings" });
  }
});

// ✅ Approve booking
router.post("/bookings/:id/approve", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking approved successfully", booking });
  } catch (error) {
    console.error("❌ Approve error:", error);
    res.status(500).json({ message: "Server error approving booking" });
  }
});

// ✅ Reject booking
router.post("/bookings/:id/reject", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking rejected successfully", booking });
  } catch (error) {
    console.error("❌ Reject error:", error);
    res.status(500).json({ message: "Server error rejecting booking" });
  }
});

export default router;
