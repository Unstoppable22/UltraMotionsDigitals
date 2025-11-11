import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config/env";

export default function LaunchSection({ onClose, selectedLocation }) {
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
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      setMediaError("File too large. Please upload media under 2MB.");
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
      return (
        <video
          src={fileUrl}
          controls
          className="w-full max-h-48 rounded shadow object-contain my-2"
        />
      );
    } else if (media.type.startsWith("image/")) {
      return (
        <img
          src={fileUrl}
          alt="Uploaded preview"
          className="w-full max-h-48 rounded shadow object-cover my-2"
        />
      );
    } else {
      return <p className="text-sm text-red-500">Unsupported file type.</p>;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setErrorMessage("Please select start and end dates.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("billboardId", selectedLocation?.id || "N/A");
      formData.append("billboardTitle", selectedLocation?.name || "Unnamed");
      formData.append("userId", "test-user"); // replace with actual user ID
      formData.append("userName", "John Doe"); // replace with logged-in user's name
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("agreed", true);
      if (media) formData.append("media", media);

      await axios.post(`${API_BASE_URL}/api/bookings`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("✅ Booking successful!");
      setStartDate("");
      setEndDate("");
      setMedia(null);
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      console.error(err);
      setErrorMessage("❌ Failed to submit booking.");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
      <div className="max-w-xl w-full bg-[#e5f4fb] p-6 rounded-xl shadow-2xl relative overflow-y-auto max-h-[90vh] animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-black text-xl font-bold hover:text-red-600"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Launch Your Campaign
        </h2>

        {selectedLocation && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              {selectedLocation.name}
            </h3>
            <img
              src={selectedLocation.image}
              alt="Ad location"
              className="rounded shadow mb-2 max-h-48 object-cover w-full"
            />
            <p className="text-sm text-gray-600">
              {selectedLocation.description}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Media Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Media (Max: 2MB)
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className="w-full border rounded px-3 py-2"
            />
            {mediaError && <p className="text-sm text-red-500 mt-1">{mediaError}</p>}
            {getMediaPreview()}
          </div>

          <div className="mb-4 text-sm">
            <label className="inline-flex items-center">
              <input type="checkbox" required className="mr-2" />
              I agree to the Advertising guideline.
            </label>
          </div>

          {errorMessage && <p className="text-red-600 mb-2">{errorMessage}</p>}
          {successMessage && <p className="text-green-600 mb-2">{successMessage}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 rounded font-bold hover:bg-[#101110] transition duration-200"
          >
            {loading ? "Submitting..." : "BOOK NOW"}
          </button>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
