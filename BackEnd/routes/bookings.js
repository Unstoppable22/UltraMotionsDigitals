import express from "express";
import multer from "multer";
import path from "path";
import Booking from "../models/Booking.js";

const router = express.Router();

// ✅ Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/", "video/"];
    if (allowedTypes.some((type) => file.mimetype.startsWith(type))) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only image or video allowed."));
    }
  },
});

// ✅ CREATE new booking
router.post("/", upload.single("media"), async (req, res) => {
  try {
    const { billboardId, billboardTitle, userId, userName, startDate, endDate } = req.body;

    const newBooking = new Booking({
      billboardId,
      billboardTitle,
      userId,
      userName,
      startDate,
      endDate,
      mediaUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newBooking.save();
    res.status(201).json({ message: "✅ Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
});

// ✅ GET all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// ✅ APPROVE booking
router.post("/:id/approve", async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "✅ Booking approved successfully", booking: updated });
  } catch (error) {
    console.error("❌ Error approving booking:", error);
    res.status(500).json({ message: "Failed to approve booking" });
  }
});

// ✅ REJECT booking
router.post("/:id/reject", async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "🚫 Booking rejected successfully", booking: updated });
  } catch (error) {
    console.error("❌ Error rejecting booking:", error);
    res.status(500).json({ message: "Failed to reject booking" });
  }
});

export default router;
