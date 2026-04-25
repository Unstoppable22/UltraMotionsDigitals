import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [user, setUser] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Consistency for token retrieval
  const token = localStorage.getItem("userToken") || localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const API_BASE = "https://ultramotionsdigitals.onrender.com";
        
        // 1. Fetch user profile
        const userRes = await axios.get(`${API_BASE}/api/auth/profile`, config);
        setUser(userRes.data);

        // 2. Fetch user's campaigns 
        const campaignsRes = await axios.get(`${API_BASE}/api/bookings/my-bookings`, config);
        setCampaigns(campaignsRes.data);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        // If unauthorized or token expired, send to login
        if (err.response?.status === 401) {
            localStorage.removeItem("userToken");
            localStorage.removeItem("token");
            navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center italic">
        Loading your dashboard...
      </div>
    );
  }

  // Helper to get initials or first name safely
  const displayName = user.name || user.userName || user.firstName || "Advertiser";
  const firstName = displayName.split(" ")[0];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Welcome Section */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome, <span className="text-blue-500">{firstName}</span>!
          </h1>
          <p className="text-gray-400 mt-2">Manage your Ultra Motion billboard campaigns here.</p>
        </header>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-blue-500 transition-all duration-300">
            <h2 className="text-xl font-bold mb-2">Create a Campaign</h2>
            <p className="text-gray-400 mb-6">Launch a new billboard marketing campaign and track its live status.</p>
            <button 
              onClick={() => navigate("/category")} 
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-bold w-full shadow-lg transition"
            >
              Get Started
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-green-500 transition-all duration-300">
            <h2 className="text-xl font-bold mb-2">Support & Help</h2>
            <p className="text-gray-400 mb-6">Questions about your placement? Our 24/7 team is ready to assist.</p>
            <button 
              onClick={() => window.location.href='mailto:support@ultramotionsdigitals.com'} 
              className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-bold w-full shadow-lg transition"
            >
              Contact Support
            </button>
          </div>
        </div>

        {/* Campaign List */}
        <section className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Your Recent Activities</h2>
            <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-mono">
              {campaigns.length} Total
            </span>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-700 rounded-xl">
              <p className="text-gray-500 text-lg">No active campaigns found.</p>
              <button onClick={() => navigate("/category")} className="text-blue-400 mt-3 hover:underline font-medium">
                Book your first billboard now →
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div 
                  key={campaign._id} 
                  className="bg-gray-700 p-6 rounded-xl border border-gray-600 flex flex-col justify-between hover:shadow-2xl transition"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg leading-tight truncate mr-2">
                        {/* Match the billboardTitle from your JSON */}
                        {campaign.billboardTitle === "Unnamed" ? "Billboard Campaign" : campaign.billboardTitle}
                      </h3>
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider 
                        ${campaign.status === "approved" ? "bg-green-900 text-green-200" : 
                          campaign.status === "rejected" ? "bg-red-900 text-red-100" : 
                          "bg-yellow-900 text-yellow-200"}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mb-1 font-mono uppercase">Ref: {campaign.billboardId}</p>
                    <p className="text-gray-300 text-sm mb-6">
                      Booked: {new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/campaign/${campaign._id}`)}
                    className="text-sm bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white py-2.5 rounded-lg font-bold w-full border border-blue-500/30 transition-all"
                  >
                    View Full Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}