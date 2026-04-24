import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [user, setUser] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Make sure you are consistent with "userToken" vs "token"
  const token = localStorage.getItem("userToken") || localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // 1. Fetch user profile
        const userRes = await axios.get(
          "https://ultramotionsdigitals.onrender.com/api/auth/profile",
          config
        );
        setUser(userRes.data);

        // 2. Fetch user's campaigns 
        // Note: I changed the URL to match the bookings route we set up earlier
        const campaignsRes = await axios.get(
          "https://ultramotionsdigitals.onrender.com/api/bookings/my-bookings",
          config
        );
        setCampaigns(campaignsRes.data);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        <h1 className="text-3xl font-bold mb-8">
          Welcome, {user.name ? user.name.split(" ")[0] : user.firstName || "Advertiser"}!
        </h1>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500 transition">
            <h2 className="text-xl font-semibold mb-2">Create a Campaign</h2>
            <p className="text-gray-400 mb-6">Launch a new billboard marketing campaign and track its status.</p>
            <button onClick={() => navigate("/category")} className="bg-blue-600 hover:bg-blue-700 py-3 px-6 rounded-lg font-bold w-full transition">
              Get Started
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-green-500 transition">
            <h2 className="text-xl font-semibold mb-2">Support & Help</h2>
            <p className="text-gray-400 mb-6">Need help with your billboard placement? Contact our team.</p>
            <button onClick={() => window.location.href='mailto:support@ultramotionsdigitals.com'} className="bg-green-600 hover:bg-green-700 py-3 px-6 rounded-lg font-bold w-full transition">
              Contact Support
            </button>
          </div>
        </div>

        {/* Campaign List */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-6">Your Recent Activities</h2>
          {campaigns.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No campaigns found.</p>
              <button onClick={() => navigate("/category")} className="text-blue-400 mt-2 hover:underline">Book your first billboard now</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map((campaign) => (
                <div key={campaign._id} className="bg-gray-700 p-5 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">{campaign.locationName || "Billboard Campaign"}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase 
                      ${campaign.status === "approved" ? "bg-green-900 text-green-200" : "bg-yellow-900 text-yellow-200"}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">Booked on: {new Date(campaign.createdAt).toLocaleDateString()}</p>
                  <button
                    onClick={() => navigate(`/campaign/${campaign._id}`)}
                    className="text-sm bg-gray-600 hover:bg-gray-500 py-2 rounded font-medium w-full transition"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}