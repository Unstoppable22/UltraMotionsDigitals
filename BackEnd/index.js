import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
console.log("✅ Backend starting...");

// ------------------------------
// 1. CORS Configuration
// ------------------------------
const allowedOrigins = [
  "https://ultramotiondigitals.com",
  "https://ultramotiondigitals.com/",
  "https://www.ultramotiondigitals.com",
  "http://localhost:5173", // Keep this for your local testing
  "https://ultra-motions-digitals-99fx.vercel.app"
];

// Main CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or keep-alive pings)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS blocked for origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// 2. Manual Header Override (The "Final Boss" Fix for Preflight)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }
  next();
});

// ------------------------------
// 2. Standard Middleware
// ------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ------------------------------
// 3. Routes (Wrapped in a check)
// ------------------------------
app.use("/api/auth", (req, res, next) => {
    console.log(`📩 Auth Route Hit: ${req.method} ${req.url}`);
    next();
}, authRoutes);

app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("✅ Ultra Motions Digitals Backend is running!");
});

app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

// ------------------------------
// 4. Global Error Handler
// ------------------------------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ 
    message: "Something went wrong!", 
    error: err.message 
  });
});

// ------------------------------
// 5. Keep-Alive Logic (Prevents Render Sleep)
// ------------------------------
const keepAlive = () => {
  const url = `https://ultramotionsdigitals.onrender.com/`; 
  setInterval(async () => {
    try {
      await axios.get(url);
      console.log("⚓ Keep-alive ping sent successfully");
    } catch (err) {
      console.error("❌ Keep-alive failed:", err.message);
    }
  }, 840000); // 14 minutes
};

// ------------------------------
// 6. Database & Server Start
// ------------------------------
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from your .env file!");
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      keepAlive(); 
    });
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  }
};

startServer();