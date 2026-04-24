import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard({ API_BASE_URL }) {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  // --- FETCH DATA FROM BACKEND ---
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Make sure your backend has these endpoints: /api/admin/users and /api/admin/bookings
      const [usersRes, bookingsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/users`, config),
        axios.get(`${API_BASE_URL}/api/admin/bookings`, config)
      ]);

      setUsers(usersRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [API_BASE_URL]);

  // --- ACTIONS ---
  const startEdit = (user) => {
    setEditingUserId(user._id);
    setEditForm({ name: user.name, email: user.email });
  };

  const handleBookingStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/api/admin/bookings/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh list
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  if (loading) return <div className="p-10 text-center text-xl">Loading Dashboard Data...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Management Portal</h1>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="bg-gray-800 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Registered Users ({users.length})</h2>
          </div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Photo</th>
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Email</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 text-center">
                    {user.profilePhoto ? (
                      <img src={`${API_BASE_URL}/uploads/${user.profilePhoto}`} className="w-12 h-12 rounded-full object-cover shadow-sm" alt="User" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-gray-500">?</div>
                    )}
                  </td>
                  <td className="p-4">
                    {editingUserId === user._id ? (
                      <input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="border rounded px-2 py-1 w-full" />
                    ) : user.name || `${user.firstName} ${user.lastName}`}
                  </td>
                  <td className="p-4">
                    {editingUserId === user._id ? (
                      <input value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="border rounded px-2 py-1 w-full" />
                    ) : user.email}
                  </td>
                  <td className="p-4 text-center space-x-2">
                    {editingUserId === user._id ? (
                      <button onClick={() => setEditingUserId(null)} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">Save</button>
                    ) : (
                      <>
                        <button onClick={() => startEdit(user)} className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">Edit</button>
                        <button onClick={() => handleDeleteUser(user._id)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-800 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Billboard Campaigns ({bookings.length})</h2>
          </div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">User</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-700">{b.userName || "Unknown User"}</td>
                  <td className="p-4 text-gray-600">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${b.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-center space-x-2">
                    <button onClick={() => handleBookingStatus(b._id, "approved")} className="bg-green-600 text-white px-3 py-1 rounded-md text-sm">Approve</button>
                    <button onClick={() => handleBookingStatus(b._id, "rejected")} className="bg-red-600 text-white px-3 py-1 rounded-md text-sm">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}