import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/**
 * @route   GET /api/bookings/my-bookings
 * @desc    Get logged in user's campaign history
 */
router.get("/my-bookings", protect, async (req, res) => {
  try {
    // Finds bookings where 'userId' matches the logged-in user
    // Make sure your Booking model uses 'userId' (or change this to 'user' if that's your field name)
    const myBookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(myBookings);
  } catch (error) {
    console.error("❌ FETCH ERROR:", error.message);
    res.status(500).json({ message: "Could not fetch campaign history" });
  }
});

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 */
router.post("/", protect, upload.single("media"), async (req, res) => {
  try {
    const bookingData = {
      billboardId: req.body.billboardId || `BILL-${Date.now()}`,
      userId: req.user?._id,
      userName: req.user?.name || `${req.user?.firstName} ${req.user?.lastName}`,
      userEmail: req.user?.email,
      billboardTitle: req.body.billboardTitle || "Standard billboard",
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      mediaUrl: req.file ? `/uploads/${req.file.filename}` : "",
      status: "pending"
    };

    const booking = new Booking(bookingData);
    await booking.save();
    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error("❌ SAVING ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;