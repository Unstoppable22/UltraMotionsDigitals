import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const token = localStorage.getItem("userToken") || localStorage.getItem("token");
  const API_BASE = "https://ultramotionsdigitals.onrender.com";


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setName(res.data.name || res.data.userName);
        setEmail(res.data.email);
        
        // Fix photo preview path
        if (res.data.profilePhoto) {
          setPhotoPreview(`${API_BASE}/uploads/${res.data.profilePhoto}`);
        }
      } catch (err) {
        console.error("Fetch Profile Error:", err);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  // Update Profile Text Info
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/auth/profile`,
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.user);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  // Upload profile photo
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      const res = await axios.post(
        `${API_BASE}/api/auth/profile/photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Profile photo updated!");
      setUser((prev) => ({ ...prev, profilePhoto: res.data.profilePhoto }));
    } catch (err) {
      console.error(err);
      alert("Photo upload failed");
    }
  };

  // Change Password
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert("Please fill in both password fields.");
      return;
    }

    try {
      await axios.put(
        `${API_BASE}/api/auth/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Password change failed");
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

        {/* Profile Photo */}
        <div className="mb-6">
          <div className="relative inline-block">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile"
                className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-blue-600 shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 mx-auto rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600 text-gray-400">
                No Photo
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <input type="file" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
          <p className="mt-2 text-xs text-gray-400 font-mono italic">Click icon to change photo</p>
        </div>

        {!editMode ? (
          <>
            <div className="text-left space-y-3 bg-gray-700/30 p-4 rounded-lg mb-6">
              <p className="text-lg"><strong>Name:</strong> {user.name || "N/A"}</p>
              <p className="text-lg"><strong>Email:</strong> {user.email}</p>
              <p className="text-sm text-gray-400"><strong>Role:</strong> {user.role}</p>
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold mb-3 transition"
            >
              Edit Profile Info
            </button>

            <div className="border-t border-gray-700 pt-6 mt-6 text-left">
              <h3 className="text-xl font-semibold mb-4">Security</h3>
              <input
                type="password"
                placeholder="Current Password"
                className="w-full p-3 mb-2 rounded-md bg-gray-700 border border-gray-600 focus:border-purple-500 outline-none"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full p-3 mb-4 rounded-md bg-gray-700 border border-gray-600 focus:border-purple-500 outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                onClick={handleChangePassword}
                className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-md font-semibold transition"
              >
                Update Password
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="w-full border border-red-600 text-red-500 hover:bg-red-600 hover:text-white py-3 rounded-lg font-semibold mt-8 transition"
            >
              Logout Account
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-3 rounded-md bg-gray-700 border border-blue-500 text-white outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-md font-semibold transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-md font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}