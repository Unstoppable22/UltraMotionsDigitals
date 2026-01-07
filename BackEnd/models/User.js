import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  name: { type: String }, 
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, // Ensures "Email@me.com" and "email@me.com" are treated the same
    trim: true 
  },
  password: { type: String, required: true },
  phone: { type: String }, 
  role: { type: String, default: "user", enum: ["user", "admin"] },
}, { 
  timestamps: true,
  // Explicitly tell Mongoose which collection to use to avoid "buffering" issues
  collection: 'users' 
});

// Automatically combine names before saving
userSchema.pre("save", async function (next) {
  if (this.firstName && this.lastName) {
    this.name = `${this.firstName} ${this.lastName}`;
  }

  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Prevent Mongoose from creating multiple models if the server restarts (Common on Render)
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;