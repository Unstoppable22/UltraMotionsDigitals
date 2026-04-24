import React, { useState } from "react";

export default function AdminDashboard({ 
  users = [], 
  bookings = [], 
  API_BASE_URL = "", 
  handleSave, 
  handleDeleteUser, 
  handleBookingStatus 
}) {
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  const startEdit = (user) => {
    setEditingUserId(user._id);
    setEditForm({ name: user.name, email: user.email });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Management Portal</h1>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="bg-gray-800 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Registered Users</h2>
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
                    ) : user.name}
                  </td>
                  <td className="p-4">
                    {editingUserId === user._id ? (
                      <input value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="border rounded px-2 py-1 w-full" />
                    ) : user.email}
                  </td>
                  <td className="p-4 text-center space-x-2">
                    {editingUserId === user._id ? (
                      <button onClick={() => { handleSave(user._id, editForm); setEditingUserId(null); }} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">Save</button>
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
            <h2 className="text-xl font-semibold text-white">Recent Billboard Bookings</h2>
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
                  <td className="p-4 font-medium text-gray-700">{b.userName || "Unknown"}</td>
                  <td className="p-4 text-gray-600">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${b.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
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
  );
}