import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Sparkles, Gem, Heart } from "lucide-react";
import CreationItem from "../components/CreationItem";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLikes, setTotalLikes] = useState(0);
  const { getToken } = useAuth();
  const { user } = useUser();

  // ✅ Fetch user creations from backend
  const getDashboardData = async () => {
    try {
      setLoading(true);
      const token = await getToken(); // ✅ await the async token
      const { data } = await axios.get("/api/user/get-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCreations(data.creations);

        // Calculate total likes received
        const likeCount = data.creations.reduce(
          (sum, c) => sum + (c.likes?.length || 0),
          0
        );
        setTotalLikes(likeCount);
      } else {
        toast.error(data.message || "Failed to fetch creations");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) getDashboardData();
  }, [user]);

  const isPremium = user?.publicMetadata?.plan === "premium";

  return (
    <div className="h-full overflow-y-auto p-6 bg-[#f9fafb]">
      {/* ---- Top Stats Cards ---- */}
      <div className="flex flex-wrap gap-4 mb-8">

        {/* Total Creations */}
        <div className="flex justify-between items-center w-72 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-slate-600">
            <p className="text-sm font-medium">Total Creations</p>
            <h2 className="text-2xl font-semibold">{creations.length}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] flex justify-center items-center">
            <Sparkles className="w-5 text-white" />
          </div>
        </div>

        {/* Total Likes */}
        <div className="flex justify-between items-center w-72 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-slate-600">
            <p className="text-sm font-medium">Total Likes Received</p>
            <h2 className="text-2xl font-semibold">{totalLikes}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F43F5E] to-[#EC4899] flex justify-center items-center">
            <Heart className="w-5 text-white" />
          </div>
        </div>

        {/* Active Plan */}
        <div className="flex justify-between items-center w-72 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="text-slate-600">
            <p className="text-sm font-medium">Active Plan</p>
            <h2 className="text-2xl font-semibold">
              {isPremium ? "Premium" : "Free"}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#9234EA] to-[#5A15C2] flex justify-center items-center">
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>

      {/* ---- Recent Creations ---- */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Recent Creations
        </h2>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading creations...</p>
        ) : creations.length === 0 ? (
          <p className="text-gray-500 text-sm">No creations yet.</p>
        ) : (
          creations.map((item) => <CreationItem key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
};

export default Dashboard;
