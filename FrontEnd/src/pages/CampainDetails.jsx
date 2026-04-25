import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE = "https://ultramotionsdigitals.onrender.com";

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const token = localStorage.getItem("userToken") || localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please login again.");
          return;
        }

        const res = await axios.get(`${API_BASE}/api/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setCampaign(res.data);
      } catch (err) {
        console.error("Error loading campaign:", err);
        setError(err.response?.data?.message || "Failed to load campaign details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  if (loading) return <div className="p-10 text-white bg-gray-900 min-h-screen flex items-center justify-center">Loading Campaign Details...</div>;
  
  if (error) return (
    <div className="p-10 text-white bg-gray-900 min-h-screen text-center">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={() => navigate(-1)} className="bg-blue-600 px-4 py-2 rounded">Go Back</button>
    </div>
  );

  if (!campaign) return <div className="p-10 text-white bg-gray-900 min-h-screen">Campaign not found.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <button onClick={() => navigate(-1)} className="mb-6 text-blue-400 hover:underline flex items-center gap-2">
        ← Back to Dashboard
      </button>
      
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 max-w-5xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {campaign?.billboardTitle === "Unnamed" ? "Billboard Campaign" : campaign?.billboardTitle}
            </h1>
            <p className="text-gray-400 mt-1">Ref ID: {campaign?.billboardId}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${
            campaign?.status === 'approved' ? 'bg-green-900 text-green-200' : 
            campaign?.status === 'rejected' ? 'bg-red-900 text-red-200' : 'bg-blue-900 text-blue-200'
          }`}>
            {campaign?.status}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Customer Name</p>
                <p className="font-semibold">{campaign?.userName || "Not Provided"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Campaign Type</p>
                <p className="font-semibold">{campaign?.campaignType || "Standard"}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Email Address</p>
              <p className="font-semibold">{campaign?.userEmail}</p>
            </div>

            <div className="p-4 bg-gray-700 rounded-xl border border-gray-600">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-400 text-xs">START DATE</p>
                  <p className="font-bold">{new Date(campaign?.startDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">END DATE</p>
                  <p className="font-bold">{new Date(campaign?.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Campaign Creative</p>
            <div className="bg-gray-700 p-2 rounded-xl border border-gray-600 overflow-hidden shadow-inner">
              {campaign?.mediaUrl ? (
                <img 
                  src={`${API_BASE}${campaign.mediaUrl}`} 
                  alt="Billboard Creative" 
                  className="rounded-lg w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => e.target.src = "https://via.placeholder.com/600x400?text=Image+Loading+Error"}
                />
              ) : (
                <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg text-gray-400">
                   <p>No media uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}