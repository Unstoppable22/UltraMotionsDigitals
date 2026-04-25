import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://ultramotionsdigitals.onrender.com/api/auth/login", 
        { 
          email: email.toLowerCase().trim(), 
          password 
        }
      );
      
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token); 
        
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        // ✅ THE FIX: Notify the Navbar that auth state has changed
        window.dispatchEvent(new Event("authChange"));

        navigate("/user-dashboard");
      } else {
        setError("Server response error. Please try again.");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Invalid email or password";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-4 text-center">User Login</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded mb-3 text-sm text-center">
            {error}
          </div>
        )}

        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 mb-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
        />

        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
        />

        <button 
          type="submit" 
          disabled={loading} 
          className={`w-full py-3 rounded-md font-semibold transition duration-200 ${
            loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-3 text-gray-400 text-sm">
          New here? <a href="/signup" className="text-blue-400 hover:underline">Sign Up</a>
        </p>
      </form>
    </div>
  );
}