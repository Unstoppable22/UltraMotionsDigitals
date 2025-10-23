import express from "express";
import Booking from "../models/Booking.js"; // ✅ note the two dots "../"

const router = express.Router();

// ✅ Fetch all bookings
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// ✅ Approve or reject a booking
router.post("/bookings/:id/:action", async (req, res) => {
  try {
    const { id, action } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = action === "approve" ? "approved" : "rejected";
    await booking.save();

    res.json({ message: `Booking ${booking.status} successfully!` });
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ message: "Failed to update booking" });
  }
});

export default router;
