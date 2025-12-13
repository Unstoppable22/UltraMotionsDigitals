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

  const token = localStorage.getItem("userToken");

  // Fetch User Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
        setPhotoPreview(res.data.profilePhoto ? `http://localhost:5000/uploads/${res.data.profilePhoto}` : null);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, [token]);

  // Update Profile
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.user);
      setEditMode(false);
    } catch (err) {
      console.log(err);
      alert("Update failed.");
    }
  };

  // Upload profile photo
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/profile/photo",
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
      console.log(err);
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
        "http://localhost:5000/api/auth/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Password change failed");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-4">Your Profile</h2>

        {/* Profile Photo */}
        <div className="mb-4">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Profile"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-2"
            />
          ) : (
            <div className="w-32 h-32 mx-auto rounded-full bg-gray-700 flex items-center justify-center mb-2">
              No Photo
            </div>
          )}
          <input
            type="file"
            onChange={handlePhotoUpload}
            className="mt-2 text-sm text-gray-300"
          />
        </div>

        {!editMode ? (
          <>
            <p className="text-lg mb-2"><strong>Name:</strong> {user.name}</p>
            <p className="text-lg mb-4"><strong>Email:</strong> {user.email}</p>

            <button
              onClick={() => setEditMode(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-semibold mb-3"
            >
              Edit Profile
            </button>

            <div className="mb-4 mt-4 text-left">
              <h3 className="text-xl font-semibold mb-2">Change Password</h3>
              <input
                type="password"
                placeholder="Current Password"
                className="w-full p-3 mb-2 rounded-md bg-gray-700 text-white"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full p-3 mb-2 rounded-md bg-gray-700 text-white"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                onClick={handleChangePassword}
                className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-md font-semibold"
              >
                Update Password
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-md font-semibold mt-3"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              className="w-full p-3 mb-3 rounded-md bg-gray-700 text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleUpdate}
              className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-md font-semibold mb-3"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="w-full bg-gray-600 hover:bg-gray-700 py-3 rounded-md font-semibold"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
