import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "supersecretkey22",
    { expiresIn: "30d" }
  );
};

// @desc    Register new user
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });
    
    if (userExists) {
      return res.status(400).json({ message: "User already registered with this email" });
    }

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password, // Password hashing should happen in your User Model pre-save hook
      phone,
    });

    // ONLY ONE RESPONSE HERE
    return res.status(201).json({
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
    console.error("🔥 Signup Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "Server error during signup", error: error.message });
  }
};

// @desc    Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
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
    console.error("🔥 Login Error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};