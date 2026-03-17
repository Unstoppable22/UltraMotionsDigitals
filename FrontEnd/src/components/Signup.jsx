import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send the fields your backend expects
      const requestBody = { firstName, lastName, email, password };

      console.log("📤 Sending signup request:", requestBody);

      const response = await axios.post(
  "https://ultramotionsdigitals.onrender.com/api/auth/signup",
  { firstName, lastName, email, password },
  { headers: { "Content-Type": "application/json" } }
);

      console.log("✅ Signup successful:", response.data);
      navigate("/login");
    } catch (err) {
      // Extract backend error message clearly
      const errorMessage =
        err.response?.data?.message || err.response?.data?.error || err.message;

      console.error("⚠️ Signup error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <form
        onSubmit={handleSignup}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm"
      >
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
/>

<input 
  type="text"
  placeholder="Last Name"
  value={lastName}
  onChange={(e) => setLastName(e.target.value)}
  required
/>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 mb-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className={`w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-semibold transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="text-center mt-3 text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}