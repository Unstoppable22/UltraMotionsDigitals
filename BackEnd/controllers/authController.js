import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/**
 * @desc    Helper function to create a JWT
 * @notice  This MUST match the secret and field name (id) in your middleware
 */
const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET || "supersecretkey22", 
    { expiresIn: "30d" }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already registered with this email" });
    }

    // 2. Hash the password (Security step)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the user in MongoDB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4. Send back the user data and the token
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("🔥 Signup Error:", error.message);
    res.status(500).json({ message: "Server error during signup", error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Check if user exists and password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("🔥 Login Error:", error.message);
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
};