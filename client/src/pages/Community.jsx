import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Image, Heart, Share2 } from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";

axios.defaults.baseURL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const Community = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(null);
  const { getToken } = useAuth();
  const { user } = useUser();

  // ✅ Fetch public images
  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) setImages(data.creations);
      else toast.error(data.message || "Failed to fetch images");
    } catch (error) {
      console.log(error);
      toast.error("Error loading community images");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle Like (Instant UI update)
  const toggleLike = async (id) => {
    try {
      setLikeLoading(id);

      // Update UI instantly for better UX
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? {
                ...img,
                likes: img.likes.includes(user.id)
                  ? img.likes.filter((uid) => uid !== user.id)
                  : [...img.likes, user.id],
              }
            : img
        )
      );

      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { id },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (!data.success) {
        toast.error(data.message || "Failed to toggle like");
        fetchImages(); // rollback in case of failure
      }
    } catch (error) {
      console.log(error);
      toast.error("Error toggling like");
    } finally {
      setLikeLoading(null);
    }
  };

  useEffect(() => {
    if (user) fetchImages();
  }, [user]);

  return (
    <div className="min-h-screen overflow-y-auto p-6 flex flex-col gap-6 text-slate-700 bg-gray-50">
      <div className="flex items-center gap-3">
        <Image className="w-6 text-green-600" />
        <h1 className="text-xl font-semibold">Community Gallery</h1>
      </div>

      {/* Skeleton Loader */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-64 bg-gray-200 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      )}

      {/* No Data */}
      {!loading && images.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <Image className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">No public images found yet.</p>
        </div>
      )}

      {/* Image Grid */}
      {!loading && images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((item) => {
            const liked = item.likes?.includes(user?.id);
            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-300"
              >
                <img
                  src={item.content}
                  alt={item.prompt}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end text-white p-4">
                  <p className="text-sm line-clamp-2 mb-3 opacity-90">
                    {item.prompt}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleLike(item.id)}
                        disabled={likeLoading === item.id}
                        className="flex items-center gap-1 hover:scale-110 transition-transform"
                      >
                        <Heart
                          className={`w-5 h-5 transition-all duration-200 ${
                            liked
                              ? "fill-pink-500 text-pink-500"
                              : "text-gray-300 hover:text-pink-400"
                          } ${
                            likeLoading === item.id
                              ? "animate-pulse opacity-70"
                              : ""
                          }`}
                        />
                        <span>{item.likes?.length || 0}</span>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.content);
                          toast.success("Image link copied!");
                        }}
                        className="hover:scale-110 transition-transform"
                      >
                        <Share2 className="w-5 h-5 text-blue-400 hover:text-blue-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Community;
