import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/env";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("bookings");
  const [search, setSearch] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/bookings`);
      setBookings(res.data);
    } catch {
      alert("❌ Failed to fetch bookings");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) return (window.location.href = "/admin");
    fetchBookings();
  }, []);

  const updateStatus = async (id, action) => {
    try {
      await axios.post(`${API_BASE_URL}/api/admin/bookings/${id}/${action}`);
      fetchBookings();
    } catch {
      alert("❌ Failed to update status");
    }
  };

  const stats = {
    approved: bookings.filter(b => b.status === "approved").length,
    pending: bookings.filter(b => b.status === "pending").length,
    rejected: bookings.filter(b => b.status === "rejected").length,
  };

  const filtered = bookings.filter(
    b => b.userName.toLowerCase().includes(search.toLowerCase()) ||
         b.billboardTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-800 p-5 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
          <button onClick={() => setTab("bookings")} className={`block w-full py-2 rounded ${tab==="bookings"?"bg-blue-600":"hover:bg-gray-700"}`}>📋 Bookings</button>
          <button onClick={() => setTab("stats")} className={`block w-full py-2 rounded mt-2 ${tab==="stats"?"bg-blue-600":"hover:bg-gray-700"}`}>📊 Stats</button>
        </div>
        <button onClick={() => {localStorage.removeItem("adminToken");window.location.href="/admin";}} className="bg-red-600 hover:bg-red-700 py-2 rounded">Logout</button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        {tab === "bookings" ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Bookings</h2>
              <input className="bg-gray-800 border border-gray-700 p-2 rounded" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
            </div>

            <div className="overflow-x-auto bg-gray-800 rounded border border-gray-700">
              <table className="w-full">
                <thead className="bg-gray-700 text-gray-300">
                  <tr><th>Billboard</th><th>User</th><th>Status</th><th>Start</th><th>End</th><th>Media</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b._id} className="border-t border-gray-700 hover:bg-gray-750">
                      <td>{b.billboardTitle}</td>
                      <td>{b.userName}</td>
                      <td className={`font-semibold ${b.status==="approved"?"text-green-400":b.status==="rejected"?"text-red-400":"text-yellow-400"}`}>{b.status}</td>
                      <td>{new Date(b.startDate).toDateString()}</td>
                      <td>{new Date(b.endDate).toDateString()}</td>
                      <td>{b.mediaUrl ? <img src={`${API_BASE_URL}${b.mediaUrl}`} className="w-16 rounded" /> : "No media"}</td>
                      <td>
                        <button onClick={()=>updateStatus(b._id,"approve")} className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-sm mr-1">Approve</button>
                        <button onClick={()=>updateStatus(b._id,"reject")} className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-sm">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filtered.length && <p className="p-4 text-center text-gray-400">No bookings found.</p>}
            </div>
          </>
        ) : (
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-green-700/30 border border-green-600 p-5 rounded text-center">
              <p className="text-2xl font-bold">{stats.approved}</p><p>Approved</p>
            </div>
            <div className="bg-yellow-700/30 border border-yellow-600 p-5 rounded text-center">
              <p className="text-2xl font-bold">{stats.pending}</p><p>Pending</p>
            </div>
            <div className="bg-red-700/30 border border-red-600 p-5 rounded text-center">
              <p className="text-2xl font-bold">{stats.rejected}</p><p>Rejected</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
