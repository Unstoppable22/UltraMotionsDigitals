import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("userToken") || localStorage.getItem("token");
  const API_BASE = "https://ultramotionsdigitals.onrender.com";

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await axios.get(`${API_BASE}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Handle Array response (Campaigns) vs Object response (User)
        if (Array.isArray(res.data)) {
          const fallback = res.data[0];
          setUser({
            name: fallback.userName,
            email: fallback.userEmail,
            _id: fallback.userId
          });
          setName(fallback.userName || "");
          setEmail(fallback.userEmail || "");
        } else {
          setUser(res.data);
          setName(res.data.name || res.data.userName || "");
          setEmail(res.data.email || "");
          if (res.data.profilePhoto) {
            setPhotoPreview(`${API_BASE}/uploads/${res.data.profilePhoto}`);
          }
        }
      } catch (err) {
        console.error("Profile Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${API_BASE}/api/auth/profile`, 
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.user || res.data);
      setEditMode(false);
      alert("Profile Updated!");
    } catch (err) {
      alert("Update Failed");
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading Profile...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Profile Settings</h2>
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-700 border-4 border-blue-500 overflow-hidden mb-4">
            <img 
              src={photoPreview || `https://ui-avatars.com/api/?name=${name || 'User'}`} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xs text-gray-500 font-mono">ID: {user._id || "N/A"}</p>
        </div>

        {!editMode ? (
          <div className="space-y-4">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <label className="text-xs text-gray-500 uppercase font-bold">Full Name</label>
              <p className="text-lg">{name || "Not Set"}</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <label className="text-xs text-gray-500 uppercase font-bold">Email Address</label>
              <p className="text-lg">{email || user.email}</p>
            </div>
            <button 
              onClick={() => setEditMode(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition-all"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input 
              className="w-full p-4 rounded-xl bg-gray-700 border border-blue-500 text-white" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
            />
            <input 
              className="w-full p-4 rounded-xl bg-gray-700 border border-gray-600 text-white" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
            />
            <div className="flex gap-3">
              <button onClick={handleUpdate} className="flex-1 bg-green-600 py-3 rounded-xl font-bold">Save</button>
              <button onClick={() => setEditMode(false)} className="flex-1 bg-gray-600 py-3 rounded-xl font-bold">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}