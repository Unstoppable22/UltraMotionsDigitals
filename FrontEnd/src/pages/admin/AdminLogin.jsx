import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, // FIXED: Matches your Backend
        { email, password }
      );

      if (res.data.success) {
        // FIXED: Using "token" to match Protectedroute.jsx
        localStorage.setItem("token", res.data.token);
        
        // FIXED: Saving user object so the system knows you are an "admin"
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Redirect to the correct path from your App.jsx
        window.location.href = "/AdminDashboard"; 
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Ensure you are an admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Admin Portal</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-700 border-none text-white p-3 mb-4 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-700 border-none text-white p-3 mb-6 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <button
            disabled={loading}
            className={`w-full py-3 rounded-md font-bold text-white transition ${
              loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20"
            }`}
          >
            {loading ? "Authenticating..." : "Enter Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}