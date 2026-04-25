import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Use the consistent key "userToken"
  const token = localStorage.getItem("userToken");
  const API_BASE = "https://ultramotionsdigitals.onrender.com";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // If the backend sends an array, it's the wrong route!
        if (Array.isArray(res.data)) {
          console.error("Backend Error: Received an array instead of a user object.");
          return;
        }

        setUser(res.data);
        setName(res.data.name || res.data.userName || "");
        setEmail(res.data.email || "");
        
        if (res.data.profilePhoto) {
          setPhotoPreview(`${API_BASE}/uploads/${res.data.profilePhoto}`);
        }
      } catch (err) {
        console.error("Fetch Profile Error:", err);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/auth/profile`,
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Backend usually returns the updated user directly
      setUser(res.data.user || res.data);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Update failed.");
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      const res = await axios.post(`${API_BASE}/api/auth/profile/photo`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Photo updated!");
      setUser((prev) => ({ ...prev, profilePhoto: res.data.profilePhoto }));
    } catch (err) {
      alert("Photo upload failed");
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.put(`${API_BASE}/api/auth/change-password`, 
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password changed!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md text-center border border-gray-700">
        <h2 className="text-3xl font-bold mb-6">Your Profile</h2>

        <div className="mb-6">
          <div className="relative inline-block">
            <img
              src={photoPreview || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-blue-600 shadow-xl"
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer">
              <input type="file" onChange={handlePhotoUpload} className="hidden" />
              📷
            </label>
          </div>
        </div>

        {!editMode ? (
          <>
            <div className="text-left space-y-3 bg-gray-700/30 p-4 rounded-lg mb-6">
              <p><strong>Name:</strong> {user.name || user.userName || "N/A"}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <button onClick={() => setEditMode(true)} className="w-full bg-blue-600 py-3 rounded-lg font-semibold mb-3">Edit Profile</button>
            <button onClick={handleLogout} className="w-full border border-red-600 text-red-500 py-3 rounded-lg font-semibold">Logout</button>
          </>
        ) : (
          <div className="space-y-4">
            <input type="text" className="w-full p-3 rounded-md bg-gray-700" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" className="w-full p-3 rounded-md bg-gray-700" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={handleUpdate} className="w-full bg-green-600 py-3 rounded-md">Save</button>
            <button onClick={() => setEditMode(false)} className="w-full bg-gray-600 py-3 rounded-md mt-2">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}