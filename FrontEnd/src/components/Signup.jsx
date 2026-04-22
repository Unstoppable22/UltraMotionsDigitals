  import React, { useState } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";

  export default function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Added phone state just in case your backend expects the field to exist
    const [phone, setPhone] = useState(""); 
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
      e.preventDefault();
      setError(""); 

      try {
        const response = await axios.post(
          "https://ultramotionsdigitals.onrender.com/api/auth/signup",
          { 
            firstName: firstName.trim(), 
            lastName: lastName.trim(), 
            email: email.toLowerCase().trim(), 
            password,
            phone: phone.trim() || "0000000000" // Sending a default if empty
          },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.success) {
          console.log("Signup successful!");
          navigate("/login");
        }
      } catch (err) {
        // 🚨 THIS IS THE MOST IMPORTANT PART:
        // If the backend says "Email already exists", this will show it on the screen.
        const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
        setError(errorMessage);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <form onSubmit={handleSignup} className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-3xl font-bold mb-4 text-center">Sign Up</h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded mb-3 text-sm text-center">
              {error}
            </div>
          )}

          <input 
            type="text" 
            placeholder="First Name" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full p-3 mb-3 rounded-md bg-gray-700 text-white" 
          />

          <input 
            type="text" 
            placeholder="Last Name" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full p-3 mb-3 rounded-md bg-gray-700 text-white" 
          />

          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 mb-3 rounded-md bg-gray-700 text-white" 
          />

          {/* Added Phone Input to match your Ultra Motions business needs */}
          <input 
            type="text" 
            placeholder="Phone Number" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 mb-3 rounded-md bg-gray-700 text-white" 
          />

          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white" 
          />

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-semibold transition duration-200">
            Create Account
          </button>

          <p className="text-center mt-4 text-sm text-gray-400">
            Already have an account? <a href="/login" className="text-blue-400 hover:underline">Login</a>
          </p>
        </form>
      </div>
    );
  }