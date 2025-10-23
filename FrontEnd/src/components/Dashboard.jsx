import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, action) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/bookings/${id}/${action}`);
      alert(res.data.message);
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const filtered = bookings.filter((b) =>
    b.userName.toLowerCase().includes(search.toLowerCase()) ||
    b.billboardTitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📊 Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-semibold"
        >
          Logout
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search bookings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-3 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th className="p-3 text-left">Billboard</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Start</th>
              <th className="p-3 text-left">End</th>
              <th className="p-3 text-left">Media</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr
                key={b._id}
                className="border-t border-gray-700 hover:bg-gray-750 transition-all"
              >
                <td className="p-3">{b.billboardTitle}</td>
                <td className="p-3">{b.userName}</td>
                <td
                  className={`p-3 font-semibold ${
                    b.status === "approved"
                      ? "text-green-400"
                      : b.status === "rejected"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {b.status}
                </td>
                <td className="p-3">{new Date(b.startDate).toDateString()}</td>
                <td className="p-3">{new Date(b.endDate).toDateString()}</td>
                <td className="p-3">
                  {b.mediaUrl ? (
                    <img
                      src={`http://localhost:5000${b.mediaUrl}`}
                      alt="media"
                      className="w-20 rounded-md border border-gray-600"
                    />
                  ) : (
                    <span className="text-gray-400">No media</span>
                  )}
                </td>
                <td className="p-3 flex space-x-2">
                  <button
                    onClick={() => updateStatus(b._id, "approve")}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(b._id, "reject")}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-4 text-center text-gray-400">No bookings found.</p>
        )}
      </div>
    </div>
  );
}
