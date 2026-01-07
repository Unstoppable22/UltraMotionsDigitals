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


export const signup = async (req, res) => {
  try {
    // 1. Destructure the NEW fields from req.body
    const { firstName, lastName, email, password, phone } = req.body;

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already registered with this email" });
    }

    // 3. Create the user in MongoDB
    // NOTE: We do NOT hash the password here because your User.js 
    // model has the .pre("save") hook that hashes it automatically!
    const user = await User.create({
      firstName,
      lastName,
      email,
      password, // Pass plain text, Model will hash it
      phone,
    });

    // 4. Send back success response
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
    console.error("🔥 Signup Error:", error.message);
    // This sends the specific error message back to the frontend 
    // so you can see if it's a validation error or a connection error.
    res.status(500).json({ 
      message: "Server error during signup", 
      error: error.message 
    });
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