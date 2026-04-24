import express from "express";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
// Optional: Import your protect/admin middleware if you have one
// import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * NOTE: If you have admin middleware, apply it to all routes here:
 * router.use(protect);
 * router.use(admin);
 */

/* ================= USERS ================= */

// @desc    Get all users (excluding passwords)
// @route   GET /api/admin/users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// @desc    Update user details
// @route   PUT /api/admin/users/:id
router.put("/users/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json(user);
  } catch (error) {
    console.error("UPDATE USER ERROR:", error.message);
    res.status(500).json({ message: "Update failed" });
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
/* ================= USERS ================= */

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // 2. Success response
    return res.status(200).json({ 
      success: true, 
      message: "User deleted successfully" 
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error.message);
    return res.status(500).json({ message: "Delete failed on server" });
  }
});

/* ================= BOOKINGS ================= */

// @desc    Get all bookings with newest first
// @route   GET /api/admin/bookings
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("GET BOOKINGS ERROR:", error.message);
    res.status(500).json({ message: "Server error fetching bookings" });
  }
});

// @desc    Update booking status (Universal Route)
// @route   PUT /api/admin/bookings/:id
router.put("/bookings/:id", async (req, res) => {
  try {
    const { status } = req.body;

    // Validation: Ensure status is valid
    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json(booking);
  } catch (error) {
    console.error("UPDATE BOOKING ERROR:", error.message);
    res.status(500).json({ message: "Status update failed" });
  }
});

export default router;