import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [user, setUser] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const userRes = await axios.get(
          "https://ultramotionsdigitals.onrender.com/api/auth/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(userRes.data);

        // Fetch user's campaigns
        const campaignsRes = await axios.get(
          `https://ultramotionsdigitals.onrender.com/api/campaigns/user/${userRes.data._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCampaigns(campaignsRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Welcome */}
      <h1 className="text-3xl font-bold mb-6"> Welcome, {user.name ? user.name.split(" ")[0] : ""}</h1>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create Campaign */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between hover:scale-105 transform transition">
          <div>
            <h2 className="text-xl font-semibold mb-2">Create a Campaign</h2>
            <p className="text-gray-300 mb-4">
              Launch a new marketing campaign and track its performance.
            </p>
          </div>
          <button
            onClick={() => navigate("/category")}
            className="mt-auto bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-semibold w-full transition-colors"
          >
            Get Started
          </button>
        </div>

        {/* Create Ad */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between hover:scale-105 transform transition">
          <div>
            <h2 className="text-xl font-semibold mb-2">Create a New Campaign</h2>
            <p className="text-gray-300 mb-4">
              Design and publish an ad for your campaign.
            </p>
          </div>
          <button
            onClick={() => navigate("/category")}
            className="mt-auto bg-green-600 hover:bg-green-700 py-3 rounded-md font-semibold w-full transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Campaign List */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Campaigns</h2>
        {campaigns.length === 0 ? (
          <p className="text-gray-300">No campaigns executed yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {campaigns.map((campaign) => (
              <div key={campaign._id} className="bg-gray-700 p-4 rounded-md shadow hover:bg-gray-600 transition">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{campaign.title}</h3>
                  <span className={`px-2 py-1 rounded text-sm font-medium 
                    ${campaign.status === "active" ? "bg-green-600" : "bg-gray-500"}`}>
                    {campaign.status}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">{campaign.description}</p>

                {/* Example stats */}
                <div className="mb-2">
                  <p className="text-gray-400 text-xs mb-1">Progress</p>
                  <div className="bg-gray-600 h-2 rounded">
                    <div
                      className="bg-blue-500 h-2 rounded"
                      style={{ width: `${campaign.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/category/${campaign._id}`)}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-md font-semibold w-full"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
