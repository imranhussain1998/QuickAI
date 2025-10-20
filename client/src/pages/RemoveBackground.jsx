import React, { useState } from "react";
import { Eraser, ImageIcon } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const RemoveBackground = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setContent(""); // clear previous result
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", selectedFile);

      const { data } = await axios.post("/api/ai/remove-image-background", formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        },
      });

      if (data.success) {
        setContent(data.content);
        toast.success("Background removed successfully!");
      } else {
        toast.error(data.message || "Failed to remove background");
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-5 bg-white rounded-lg border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <Eraser className="w-6 text-orange-500" />
          <h1 className="text-xl font-semibold">Background Removal</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full mt-2 text-sm text-gray-600 border border-gray-300 rounded-md p-2 cursor-pointer"
        />
        <p className="text-xs text-gray-400 mt-1">
          Supports JPG, PNG, and other image formats
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer transition disabled:opacity-70"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Eraser className="w-5" />
          )}
          Remove Background
        </button>
      </form>

      {/* Right column */}
      <div className="w-full max-w-lg p-5 bg-white rounded-lg border border-gray-200 shadow-sm min-h-96 flex flex-col items-center justify-center">
        <div className="flex items-center gap-3 mb-4">
          <ImageIcon className="w-5 h-5 text-orange-500" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        {content ? (
          <img
            src={content}
            alt="Processed result"
            className="rounded-lg border border-gray-200 shadow-sm w-full object-cover"
          />
        ) : (
          <div className="flex flex-col justify-center items-center text-gray-400 mt-10">
            <ImageIcon className="w-10 h-10 mb-3" />
            <p className="text-sm text-center px-4">
              Upload an image and click “Remove Background” to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
