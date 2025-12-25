import React, { useState } from "react";

// FIXED: Added "export default function" and fixed the bracket syntax
export default function AdminDashboard({ 
  users = [], 
  bookings = [], 
  API_BASE_URL = "", 
  handleEdit, 
  handleSave, 
  handleCancel, 
  handleDeleteUser, 
  handleBookingStatus 
}) {
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  const startEdit = (user) => {
    setEditingUserId(user._id);
    setEditForm({ name: user.name, email: user.email });
    if (handleEdit) handleEdit(user);
  };

  return (
    <div className="p-4">
      {/* Users Table */}
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      <table className="w-full mb-10 border bg-white shadow-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Photo</th>
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
                    alt={user.name}
                    className="w-10 h-10 rounded-full mx-auto"
                  />
                ) : (
                  "—"
                )}
              </td>
              <td className="p-2 border">
                {editingUserId === user._id ? (
                  <input
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
                      onClick={() => {
                        handleSave(user._id, editForm);
                        setEditingUserId(null);
                      }}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingUserId(null);
                        setEditForm({ name: "", email: "" });
                        if (handleCancel) handleCancel();
                      }}
                      className="bg-gray-600 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(user)}
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
      <table className="w-full border bg-white shadow-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id} className="text-center">
              <td className="p-2 border">{b.userName || "N/A"}</td>
              <td className="p-2 border">
                {new Date(b.createdAt).toLocaleString()}
              </td>
              <td className="p-2 border uppercase text-xs font-bold">{b.status}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleBookingStatus(b._id, "approved")}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleBookingStatus(b._id, "rejected")}
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