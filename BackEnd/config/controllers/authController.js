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
      password, 
      phone,
    });

    return res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("🔥 Signup Error:", error);
    return res.status(500).json({ message: "Server error during signup", error: error.message });
  }
};

// @desc    Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
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
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during login" });
  }
};

// @desc    Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user profile (Name/Email)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Split name back into firstName/lastName if your frontend sends a single "name" string
    if (req.body.name) {
      const parts = req.body.name.trim().split(" ");
      user.firstName = parts[0] || user.firstName;
      user.lastName = parts.slice(1).join(" ") || user.lastName;
    }

    user.email = req.body.email || user.email;

    const updatedUser = await user.save();
    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// @desc    Update profile photo
export const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePhoto = req.file.filename;
    await user.save();

    res.json({ 
      success: true, 
      message: "Photo updated", 
      profilePhoto: user.profilePhoto 
    });
  } catch (error) {
    res.status(500).json({ message: "Photo upload failed", error: error.message });
  }
};