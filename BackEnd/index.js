import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fs from 'fs';

import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// 1. Directory Setup
const dir = './uploads';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

// 2. Optimized CORS Configuration
const allowedOrigins = [
    "https://ultramotiondigitals.com",
    "https://www.ultramotiondigitals.com",
    "https://ultra-motions-digitals-99fx.vercel.app",
    "http://localhost:5173"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS policy violation'), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
}));

// 3. Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// 4. Routes
app.get("/", (req, res) => {
    res.send("✅ Ultra Motions Digitals Backend is running!");
});

// Register your Auth, Booking, and Admin routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// 5. Global Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 Server Error Stack:", err.stack);
    res.status(err.status || 500).json({ 
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err : {} 
    });
});

// 6. Database Connection & Server Start
const startServer = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error("MONGO_URI is missing from Environment Variables!");
        }

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000, // Fail after 5 seconds instead of 10
            socketTimeoutMS: 45000,        // Close sockets after 45 seconds
        });

        console.log("✅ MongoDB Connected Successfully");

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Database Connection Error:", err.message);
        // Do not exit process in production (Render will restart it)
    }
};

startServer();