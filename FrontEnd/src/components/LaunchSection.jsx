import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For redirection
import { API_BASE_URL } from "../../config/env";

export default function LaunchSection({ onClose, selectedLocation }) {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaError, setMediaError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSizeMB = 2;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setMediaError("File too large. Max 2MB.");
      setMedia(null);
      return;
    }
    setMediaError("");
    setMedia(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Check Authentication
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("You must be logged in to book a campaign.");
      setTimeout(() => {
        onClose();
        navigate("/signup"); // Redirect to signup/login
      }, 2000);
      return;
    }

    if (!startDate || !endDate) {
      setErrorMessage("Please select dates.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("billboardTitle", selectedLocation?.name || "Unnamed");
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      if (media) formData.append("media", media);

      // 2. Send request with Authorization Header
      await axios.post(`${API_BASE_URL}/api/bookings`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Crucial for 'protect' middleware
        },
      });

      setSuccessMessage("✅ Booking successful!");
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || "❌ Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  // ... (Keep your getMediaPreview and modalContent JSX as it was)
  
  const modalContent = (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
      <div className="max-w-xl w-full bg-[#e5f4fb] p-6 rounded-xl shadow-2xl relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-3 right-3 text-black text-xl font-bold">&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-center">Launch Your Campaign</h2>

        {selectedLocation && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">{selectedLocation.name}</h3>
            <img src={selectedLocation.image} alt="billboard" className="rounded shadow max-h-40 w-full object-cover my-2" />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border rounded px-3 py-2" required />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Upload Media (Max 2MB)</label>
            <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} className="w-full border rounded px-3 py-2" />
            {mediaError && <p className="text-red-500 text-xs mt-1">{mediaError}</p>}
          </div>

          {errorMessage && <p className="text-red-600 text-sm mb-2 text-center">{errorMessage}</p>}
          {successMessage && <p className="text-green-600 text-sm mb-2 text-center">{successMessage}</p>}

          <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-3 rounded font-bold hover:bg-black transition">
            {loading ? "Submitting..." : "BOOK NOW"}
          </button>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}