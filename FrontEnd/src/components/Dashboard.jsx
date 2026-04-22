import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/env";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("bookings");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Get the token safely
  const getAuthHeader = () => {
    const token = localStorage.getItem("adminToken");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // ✅ ADDED: getAuthHeader() to prove you are an admin
      const res = await axios.get(`${API_BASE_URL}/api/admin/bookings/`, getAuthHeader());
      setBookings(res.data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "/admin";
    } else {
      fetchBookings();
    }
  }, []);

  const updateStatus = async (id, action) => {
    try {
      // ✅ ADDED: getAuthHeader() here too
      await axios.post(
        `${API_BASE_URL}/api/admin/bookings/${id}/${action}`, 
        {}, // Empty body
        getAuthHeader()
      );
      fetchBookings(); // Refresh the list
    } catch (err) {
      alert("Failed to update status: " + (err.response?.data?.message || "Server Error"));
    }
  };

  const filtered = bookings.filter(
    (b) =>
      b.userName?.toLowerCase().includes(search.toLowerCase()) ||
      b.billboardTitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-30 lg:w-56 bg-gray-800 p-5 flex flex-col justify-between border-r border-gray-700">
        <div>
          <h1 className="text-xl font-bold mb-6 text-blue-500">Ultra Admin</h1>
          {["bookings", "stats"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`block w-full text-left px-4 py-2 rounded mb-2 transition ${
                tab === t ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-700"
              }`}
            >
              {t === "bookings" ? "📋 Bookings" : "📊 Stats"}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            window.location.href = "/admin";
          }}
          className="bg-red-600/20 text-red-500 border border-red-600 hover:bg-red-600 hover:text-white py-2 rounded transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 overflow-auto">
        {tab === "bookings" ? (
          <>
            <div className="flex flex-col lg:flex-row gap-4 justify-between mb-6">
              <h2 className="text-2xl font-semibold">Billboard Bookings</h2>
              <input
                className="bg-gray-800 p-2 rounded border border-gray-700 focus:border-blue-500 outline-none w-full lg:w-64"
                placeholder="Search billboard or user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <p className="text-center py-10 text-gray-500">Loading bookings...</p>
            ) : (
              <div className="overflow-x-auto bg-gray-800 rounded-xl border border-gray-700">
                <table className="w-full min-w-max">
                  <thead className="bg-gray-700/50 text-gray-300">
                    <tr>
                      <th className="px-4 py-3 text-left">Billboard</th>
                      <th className="px-4 py-3 text-left">Client</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Duration</th>
                      <th className="px-4 py-3 text-left">Media</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b) => (
                      <tr key={b._id} className="border-t border-gray-700 hover:bg-gray-750 transition">
                        <td className="px-4 py-3 font-medium">{b.billboardTitle}</td>
                        <td className="px-4 py-3 text-gray-400">{b.userName}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${
                            b.status === "approved" ? "bg-green-500/10 text-green-400" :
                            b.status === "rejected" ? "bg-red-500/10 text-red-400" : 
                            "bg-yellow-500/10 text-yellow-400"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">
                          {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {b.mediaUrl ? (
                            <a href={`${API_BASE_URL}${b.mediaUrl}`} target="_blank" rel="noreferrer">
                                <img src={`${API_BASE_URL}${b.mediaUrl}`} alt="Media" className="w-12 h-12 object-cover rounded border border-gray-600" />
                            </a>
                          ) : "No File"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {b.status === "pending" && (
                            <div className="flex justify-center gap-2">
                              <button onClick={() => updateStatus(b._id, "approve")} className="p-2 bg-green-600 hover:bg-green-700 rounded-full" title="Approve">✅</button>
                              <button onClick={() => updateStatus(b._id, "reject")} className="p-2 bg-red-600 hover:bg-red-700 rounded-full" title="Reject">❌</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!filtered.length && !loading && (
                  <p className="p-10 text-center text-gray-500">No matching bookings found.</p>
                )}
              </div>
            )}
          </>
        ) : (
          /* Stats View */
          <div className="grid sm:grid-cols-3 gap-6">
            {["approved", "pending", "rejected"].map((s) => (
              <div key={s} className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
                <p className="text-3xl font-bold text-blue-500">
                  {bookings.filter((b) => b.status === s).length}
                </p>
                <p className="capitalize text-gray-400">{s} Campaigns</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}