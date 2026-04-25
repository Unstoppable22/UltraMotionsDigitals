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

// 1. GET ALL BOOKINGS FOR LOGGED IN USER
router.get("/my-bookings", protect, async (req, res) => {
  try {
    // Crucial: Use req.user._id to match the 'userId' string in your database
    const myBookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(myBookings || []);
  } catch (error) {
    console.error("❌ FETCH ERROR:", error.message);
    res.status(500).json({ message: "Could not fetch campaign history" });
  }
});

// 2. GET SINGLE BOOKING BY ID (For View Details Page)
router.get("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Campaign data not found in database." });
    }

    // Security: Only allow the owner or an admin to see this
    const isOwner = booking.userId.toString() === req.user._id.toString();
    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: You do not own this campaign." });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("❌ FETCH SINGLE ERROR:", error.message);
    res.status(500).json({ message: "Internal server error while fetching details" });
  }
});

// 3. CREATE NEW BOOKING
router.post("/", protect, upload.single("media"), async (req, res) => {
  try {
    const bookingData = {
      billboardId: req.body.billboardId || `BILL-${Date.now()}`,
      userId: req.user._id,
      userName: req.user.name || `${req.user.firstName} ${req.user.lastName}`,
      userEmail: req.user.email,
      billboardTitle: req.body.billboardTitle || "Unnamed",
      campaignType: req.body.campaignType || "Standard",
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      mediaUrl: req.file ? `/uploads/${req.file.filename}` : "",
      status: "pending",
      agreed: true
    };

    const booking = new Booking(bookingData);
    await booking.save();
    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error("❌ SAVING ERROR:", error.message);
    res.status(500).json({ error: "Failed to save booking. Please check required fields." });
  }
});

export default router;