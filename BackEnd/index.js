import express from "express";
import jwt from "jsonwebtoken";
import Booking from "../models/Booking.js"; // ✅ Make sure this exists

const router = express.Router();

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "123456";
const JWT_SECRET = "supersecretkey";

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

// ✅ Get all bookings (for Admin Dashboard)
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// ✅ Approve or Reject booking
router.post("/bookings/:id/:action", async (req, res) => {
  try {
    const { id, action } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (action === "approve") booking.status = "approved";
    else if (action === "reject") booking.status = "rejected";

    await booking.save();
    res.json({ message: `Booking ${action}ed successfully` });
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ message: "Failed to update booking" });
  }
});

export default router;
