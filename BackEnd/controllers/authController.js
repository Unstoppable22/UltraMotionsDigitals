import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/**
 * Generate JWT
 */
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.warn("⚠️ JWT_SECRET not set, using fallback");
  }

  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "supersecretkey22",
    { expiresIn: "30d" }
  );
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/signup
 */
export const signup = async (req, res) => {
  try {

    console.log("📥 Incoming signup data:", req.body); // 🔥 DEBUG

   const { firstName, lastName, email, password, phone } = req.body;

if (!firstName || !lastName || !email || !password) {
  return res.status(400).json({ message: "All required fields must be filled" });
}

const userExists = await User.findOne({ email: email.toLowerCase().trim() });
if (userExists) {
  return res.status(400).json({ message: "User already registered with this email" });
}

const user = await User.create({
  firstName: firstName.trim(),
  lastName: lastName.trim(),
  email: email.toLowerCase().trim(),
  password,
  phone,
});

res.status(201).json({
  success: true,
  token: generateToken(user._id),
  user: {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  },
});
    // ✅ 5. Success response
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("🔥 FULL Signup Error:", error); // 🔥 VERY IMPORTANT

    // ✅ Handle duplicate key error properly
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({
      message: "Server error during signup",
      error: error.message,
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    console.log("📥 Incoming login data:", req.body); // 🔥 DEBUG

    const { email, password } = req.body;

    // ✅ Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ✅ Find user
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ✅ Success
    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name, // comes from your model pre-save
        email: user.email,
      },
    });

  } catch (error) {
    console.error("🔥 FULL Login Error:", error);

    res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
};