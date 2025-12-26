import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios"; // ✅ Use 'import' instead of 'require'

import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
console.log("✅ Backend starting...");

// ------------------------------
// Middleware
// ------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://ultra-motions-digitals-99fx.vercel.app",
  "https://ultramotiondigitals.com",
  "https://www.ultramotiondigitals.com"
];

// 2. Use the CORS middleware with 'preflightContinue: false'
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS blocked for:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));

app.options("*path", cors()); // ✅ Handle preflight

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
// Keep-Alive Logic
// ------------------------------
const keepAlive = () => {
  const url = `https://ultramotionsdigitals.onrender.com`; 
  setInterval(async () => {
    try {
      await axios.get(url);
      console.log("⚓ Keep-alive ping sent successfully");
    } catch (err) {
      console.error("❌ Keep-alive failed:", err.message);
    }
  }, 840000); 
};

// ------------------------------
// Database & Server
// ------------------------------
const startServer = async () => {
  try {
    // Note: Latest Mongoose doesn't need useNewUrlParser/useUnifiedTopology
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      keepAlive(); // ✅ Start pinging once the server is up
    });
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  }
};

startServer();