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

  // --- USER ACTIONS ---
  const startEdit = (user) => {
    setEditingUserId(user._id);
    setEditForm({ name: user.name || `${user.firstName} ${user.lastName}`, email: user.email });
  };

  const handleSaveUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/admin/users/${id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingUserId(null);
      fetchData(); // Refresh list
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update user.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete user.");
    }
  };

  // --- BOOKING ACTIONS ---
  const handleBookingStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      
      // Matches the new PUT route we discussed for the backend
      await axios.put(
        `${API_BASE_URL}/api/admin/bookings/${id}`, 
        { status: status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchData(); 
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update status. Ensure backend has the PUT /bookings/:id route.");
    }
  };

  if (loading) return <div className="p-10 text-center text-xl font-sans">Loading Dashboard Data...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Management Portal</h1>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="bg-gray-800 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Registered Users ({users.length})</h2>
          </div>
          <div className="overflow-x-auto">
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
                        <img src={`${API_BASE_URL}/uploads/${user.profilePhoto}`} className="w-12 h-12 rounded-full object-cover shadow-sm mx-auto" alt="User" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-gray-500 text-xs">No Image</div>
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
                        <button onClick={() => handleSaveUser(user._id)} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600">Save</button>
                      ) : (
                        <>
                          <button onClick={() => startEdit(user)} className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600">Edit</button>
                          <button onClick={() => handleDeleteUser(user._id)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-800 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Billboard Campaigns ({bookings.length})</h2>
          </div>
          <div className="overflow-x-auto">
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
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        b.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        b.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-2">
                      <button onClick={() => handleBookingStatus(b._id, "approved")} className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700">Approve</button>
                      <button onClick={() => handleBookingStatus(b._id, "rejected")} className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}