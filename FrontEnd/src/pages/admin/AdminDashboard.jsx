import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard({ API_BASE_URL }) {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

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
      fetchData();
    } catch (err) {
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
      alert("Delete failed. Check if user still exists.");
    }
  };

  const handleBookingStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/admin/bookings/${id}`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(); 
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-xl font-semibold text-gray-600 animate-pulse">Loading Ultra Motions Dashboard...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Admin Management Portal</h1>
          <p className="text-gray-500 mt-2">Manage users and review billboard advertising campaigns</p>
        </header>

        {/* --- USERS SECTION --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-12">
          <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Registered Users ({users.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Profile</th>
                  <th className="p-4 font-semibold text-gray-600">Full Name</th>
                  <th className="p-4 font-semibold text-gray-600">Email Address</th>
                  <th className="p-4 text-center font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b last:border-0 hover:bg-gray-50 transition">
                    <td className="p-4">
                      {user.profilePhoto ? (
                        <img 
                          src={`${API_BASE_URL}/uploads/${user.profilePhoto}`} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" 
                          alt="User" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {user.firstName?.charAt(0) || "U"}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-gray-800">
                      {editingUserId === user._id ? (
                        <input 
                          value={editForm.name} 
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                          className="border border-blue-400 rounded px-3 py-1.5 w-full outline-none" 
                        />
                      ) : user.name || `${user.firstName} ${user.lastName}`}
                    </td>
                    <td className="p-4 text-gray-600">
                      {editingUserId === user._id ? (
                        <input 
                          value={editForm.email} 
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})} 
                          className="border border-blue-400 rounded px-3 py-1.5 w-full outline-none" 
                        />
                      ) : user.email}
                    </td>
                    <td className="p-4 text-center space-x-2">
                      {editingUserId === user._id ? (
                        <button onClick={() => handleSaveUser(user._id)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition">Save</button>
                      ) : (
                        <>
                          <button onClick={() => startEdit(user)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition">Edit</button>
                          <button onClick={() => handleDeleteUser(user._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- CAMPAIGNS SECTION --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-900 px-6 py-4">
            <h2 className="text-lg font-bold text-white">Active Billboard Campaigns ({bookings.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Client</th>
                  <th className="p-4 font-semibold text-gray-600">Campaign Content</th>
                  <th className="p-4 font-semibold text-gray-600">Submit Date</th>
                  <th className="p-4 font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-center font-semibold text-gray-600">Management</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-b last:border-0 hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{b.userName || "Unknown Client"}</div>
                      <div className="text-xs text-gray-500">{b.userEmail}</div>
                    </td>

                    {/* NEW: MEDIA PREVIEW SECTION */}
                    <td className="p-4">
                      {b.mediaUrl ? (
                        <div className="relative group w-24 h-14 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          <img 
                            src={`${API_BASE_URL}${b.mediaUrl}`} 
                            alt="Campaign Design" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform cursor-pointer"
                            onClick={() => window.open(`${API_BASE_URL}${b.mediaUrl}`, '_blank')}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none">
                            <span className="text-[10px] text-white font-bold">VIEW FULL</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-24 h-14 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-[10px] text-gray-400">
                          NO MEDIA
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-gray-600 text-sm">
                      {new Date(b.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        b.status === 'approved' ? 'bg-green-100 text-green-700 border border-green-200' : 
                        b.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' : 
                        'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-2">
                      <button 
                        onClick={() => handleBookingStatus(b._id, "approved")} 
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                      >
                        APPROVE
                      </button>
                      <button 
                        onClick={() => handleBookingStatus(b._id, "rejected")} 
                        className="bg-gray-100 hover:bg-red-600 hover:text-white text-gray-600 px-4 py-1.5 rounded-lg text-xs font-bold transition border border-gray-200"
                      >
                        REJECT
                      </button>
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