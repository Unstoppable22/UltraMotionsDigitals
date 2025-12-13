import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://ultramotionsdigitals.onrender.com/api/auth/signup", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSignup} className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-4 text-center">Sign Up</h2>
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500" />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-semibold">
          Sign Up
        </button>
        <p className="text-center mt-3 text-gray-400">
          Already have an account? <a href="/login" className="text-blue-400 hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}
