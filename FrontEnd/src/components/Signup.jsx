import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); 

    // 🔹 Basic frontend validation
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(
        "https://ultramotionsdigitals.onrender.com/api/auth/signup",
        { firstName, lastName, email, password }, // ✅ send separate fields
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Signup successful:", response.data);
      navigate("/login");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error("Signup error details:", errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <form onSubmit={handleSignup} className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-4 text-center">Sign Up</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded mb-3 text-sm">
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

        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white" 
        />

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-semibold">
          Sign Up
        </button>
      </form>
    </div>
  );
}