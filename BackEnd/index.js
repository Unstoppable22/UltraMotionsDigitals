import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
console.log("✅ Backend starting...");

// ------------------------------
// Middleware
// ------------------------------

// Allow JSON & URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use("/uploads", express.static("uploads"));

// CORS - configurable via environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://ultra-motions-digitals-99fx.vercel.app",
      "https://ultramotiondigitals.com",
      "https://www.ultramotiondigitals.com"
    ];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("CORS Blocked for origin:", origin); // Helps you debug in Render logs
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.options("*", cors());

// ------------------------------
// Routes
// ------------------------------
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("✅ Ultra Motions Digitals Backend is running!");
});

// ------------------------------
// Global error handler
// ------------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// ------------------------------
// Database & Server
// ------------------------------
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully!");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    process.exit(1); // Stop server if DB fails
  }
};

startServer();
const axios = require('axios'); // or use fetch

const keepAlive = () => {
  const url = `https://ultramotionsdigitals.onrender.com`; // Your backend URL
  
  setInterval(async () => {
    try {
      await axios.get(url);
      console.log("⚓ Keep-alive ping sent successfully");
    } catch (err) {
      console.error("❌ Keep-alive failed:", err.message);
    }
  }, 840000); // 14 minutes in milliseconds
};

keepAlive();
