import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/env";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchUsers();
    fetchBookings();
    setLoading(false);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Start editing
  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditForm({ name: user.name, email: user.email });
  };

  // Save changes
  const handleSave = async (id) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/users/${id}`,
        editForm,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingUserId(null);
  };

  // Delete User
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Approve / Reject Booking
  const handleBookingStatus = async (id, status) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/admin/bookings/${id}/${status}`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Users Table */}
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      <table className="w-full mb-10 border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Profile Photo</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center">
              <td className="p-2 border">
                {user.profilePhoto ? (
                  <img
                    src={`${API_BASE_URL}/uploads/${user.profilePhoto}`}
                    alt="profile"
                    className="w-12 h-12 rounded-full mx-auto"
                  />
                ) : (
                  "No photo"
                )}
              </td>
              <td className="p-2 border">
                {editingUserId === user._id ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  user.name
                )}
              </td>
              <td className="p-2 border">
                {editingUserId === user._id ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="p-2 border space-x-2">
                {editingUserId === user._id ? (
                  <>
                    <button
                      onClick={() => handleSave(user._id)}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-600 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bookings Table */}
      <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id} className="text-center">
              <td className="p-2 border">{booking.userName || "N/A"}</td>
              <td className="p-2 border">{new Date(booking.createdAt).toLocaleString()}</td>
              <td className="p-2 border">{booking.status}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleBookingStatus(booking._id, "approve")}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleBookingStatus(booking._id, "reject")}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
