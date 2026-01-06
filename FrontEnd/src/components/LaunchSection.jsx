import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

  const getMediaPreview = () => {
    if (!media) return null;
    const fileUrl = URL.createObjectURL(media);
    if (media.type.startsWith("video/")) {
      return <video src={fileUrl} controls className="w-full max-h-48 rounded shadow object-contain my-2" />;
    } else if (media.type.startsWith("image/")) {
      return <img src={fileUrl} alt="Preview" className="w-full max-h-48 rounded shadow object-cover my-2" />;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Get token from storage
    const token = localStorage.getItem("token");

    // Auth check logic
    if (!token || token === "undefined" || token === "null") {
      setErrorMessage("⚠️ Please login to book a campaign.");
      setTimeout(() => {
        onClose();
        navigate("/login"); 
      }, 2000);
      return;
    }

    if (!startDate || !endDate) {
      setErrorMessage("Please select dates.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("billboardTitle", selectedLocation?.name || "Unnamed");
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      if (media) formData.append("media", media);

      // 2. SENDING TO BACKEND
      await axios.post(`${API_BASE_URL}/api/bookings`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setSuccessMessage("✅ Booking successful!");
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      console.error("Booking Error:", err);
      if (err.response?.status === 401) {
        setErrorMessage("❌ Session expired. Please login again.");
        localStorage.removeItem("token"); 
      } else {
        setErrorMessage(err.response?.data?.message || "❌ Submission failed.");
      }
    } finally {
      setLoading(false);
    }
  }; // <--- Function properly closed here now

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
      <div className="max-w-xl w-full bg-[#e5f4fb] p-6 rounded-xl shadow-2xl relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-3 right-3 text-black text-xl font-bold hover:text-red-600 transition">
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Launch Campaign</h2>

        {selectedLocation && (
          <div className="mb-4 text-center">
            <h3 className="text-lg font-semibold mb-2">{selectedLocation.name}</h3>
            <img src={selectedLocation.image} alt="billboard" className="rounded shadow max-h-40 w-full object-cover my-2" />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border rounded px-3 py-2 text-black" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border rounded px-3 py-2 text-black" required />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Media (Max 2MB)</label>
            <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} className="w-full border rounded px-3 py-2 bg-white text-black" />
            {mediaError && <p className="text-red-500 text-xs mt-1">{mediaError}</p>}
            {getMediaPreview()}
          </div>

          <div className="mb-4 text-xs text-gray-600">
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" required className="mr-2" />
              I agree to the Advertising Guidelines.
            </label>
          </div>

          {errorMessage && <p className="text-red-600 text-sm mb-2 text-center font-bold bg-red-50 p-2 rounded">{errorMessage}</p>}
          {successMessage && <p className="text-green-600 text-sm mb-2 text-center font-bold bg-green-50 p-2 rounded">{successMessage}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded font-bold hover:bg-black transition duration-200 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "BOOK NOW"}
          </button>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}