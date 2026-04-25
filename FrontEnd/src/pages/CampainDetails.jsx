import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CampaignDetails() {
  const { id } = useParams(); // Gets the ID from the URL
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const token = localStorage.getItem("userToken") || localStorage.getItem("token");
        const res = await axios.get(`https://ultramotionsdigitals.onrender.com/api/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCampaign(res.data);
      } catch (err) {
        console.error("Error loading campaign:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  if (loading) return <div className="p-10 text-white bg-gray-900 min-h-screen">Loading Details...</div>;
  if (!campaign) return <div className="p-10 text-white bg-gray-900 min-h-screen">Campaign not found.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <button onClick={() => navigate(-1)} className="mb-6 text-blue-400 hover:underline">← Back to Dashboard</button>
      
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold mb-4">{campaign.billboardTitle}</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-400">Status</p>
            <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm font-bold uppercase">
              {campaign.status}
            </span>

            <div className="mt-6 space-y-4">
              <p><strong>Start Date:</strong> {new Date(campaign.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(campaign.endDate).toLocaleDateString()}</p>
              <p><strong>Reference ID:</strong> {campaign.billboardId}</p>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-xl">
            <p className="text-gray-400 mb-2">Campaign Creative</p>
            {campaign.mediaUrl ? (
              <img 
                src={`https://ultramotionsdigitals.onrender.com${campaign.mediaUrl}`} 
                alt="Billboard Creative" 
                className="rounded-lg w-full h-auto shadow-lg"
              />
            ) : (
              <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-500 rounded-lg">
                No media uploaded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}