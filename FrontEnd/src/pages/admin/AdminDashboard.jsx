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
      const [uRes, bRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/users`, config),
        axios.get(`${API_BASE_URL}/api/admin/bookings`, config)
      ]);
      setUsers(uRes.data);
      setBookings(bRes.data);
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
      await axios.put(`${API_BASE_URL}/api/admin/users/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      alert("Delete failed.");
    }
  };

  const handleBookingStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/api/admin/bookings/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-100 font-sans">
      <div className="text-xl font-bold text-gray-700 animate-bounce">ULTRA MOTIONS ADMIN...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Ultra Motions Dashboard</h1>
          <p className="text-gray-500">Real-time billboard management & client oversight</p>
        </header>

        {/* --- USERS SECTION --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-12">
          <div className="bg-gray-900 px-6 py-4">
            <h2 className="text-lg font-bold text-white">Clients ({users.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-sm font-bold text-gray-600">User</th>
                  <th className="p-4 text-sm font-bold text-gray-600">Email</th>
                  <th className="p-4 text-center text-sm font-bold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b last:border-0 hover:bg-gray-50 transition">
                    <td className="p-4 font-medium">
                      {editingUserId === user._id ? (
                        <input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="border rounded px-2 py-1 w-full" />
                      ) : user.name || `${user.firstName} ${user.lastName}`}
                    </td>
                    <td className="p-4 text-gray-600">
                      {editingUserId === user._id ? (
                        <input value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="border rounded px-2 py-1 w-full" />
                      ) : user.email}
                    </td>
                    <td className="p-4 text-center space-x-2">
                      {editingUserId === user._id ? (
                        <button onClick={() => handleSaveUser(user._id)} className="text-green-600 font-bold">Save</button>
                      ) : (
                        <>
                          <button onClick={() => startEdit(user)} className="text-blue-600 font-bold">Edit</button>
                          <button onClick={() => handleDeleteUser(user._id)} className="text-red-500 font-bold">Delete</button>
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
            <h2 className="text-lg font-bold text-white">Ad Campaigns ({bookings.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-sm font-bold text-gray-600">Client</th>
                  <th className="p-4 text-sm font-bold text-gray-600">Media</th>
                  <th className="p-4 text-sm font-bold text-gray-600">Status</th>
                  <th className="p-4 text-center text-sm font-bold text-gray-600">Live Control</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="font-bold text-sm">{b.userName}</div>
                      <div className="text-[10px] text-gray-400 uppercase">{b.billboardTitle}</div>
                    </td>
                    <td className="p-4">
                      <img 
                        src={`${API_BASE_URL}${b.mediaUrl}`} 
                        alt="Campaign" 
                        className="w-16 h-10 object-cover rounded shadow-sm cursor-pointer hover:scale-110 transition"
                        onClick={() => window.open(`${API_BASE_URL}${b.mediaUrl}`, '_blank')}
                      />
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                        b.status === 'running' ? 'bg-blue-600 text-white border-blue-700 shadow-md' : 
                        b.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' : 
                        b.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' : 
                        b.status === 'completed' ? 'bg-gray-200 text-gray-700 border-gray-300' :
                        'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center space-x-2">
                        {b.status === "pending" && (
                          <>
                            <button onClick={() => handleBookingStatus(b._id, "approved")} className="bg-green-600 text-white px-3 py-1 rounded text-[10px] font-bold shadow-sm">APPROVE</button>
                            <button onClick={() => handleBookingStatus(b._id, "rejected")} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-[10px] font-bold">REJECT</button>
                          </>
                        )}
                        {b.status === "approved" && (
                          <button onClick={() => handleBookingStatus(b._id, "running")} className="bg-blue-600 text-white px-4 py-1.5 rounded text-[10px] font-bold shadow-lg animate-pulse">START CAMPAIGN</button>
                        )}
                        {b.status === "running" && (
                          <button onClick={() => handleBookingStatus(b._id, "completed")} className="bg-black text-white px-3 py-1 rounded text-[10px] font-bold">MARK ENDED</button>
                        )}
                      </div>
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