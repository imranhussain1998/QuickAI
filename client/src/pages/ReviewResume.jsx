import React, { useState } from "react";
import { FileText, Upload, Sparkles } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const ReviewResume = () => {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setContent(""); // clear previous result
  };

  const handleReview = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload a PDF file first.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", file);

      const { data } = await axios.post("/api/ai/resume-review", formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setContent(data.content);
        toast.success("Resume reviewed successfully!");
        console.log("Resume Review Content:", data.content);
      } else {
        toast.error(data.message || "Failed to review resume");
        console.error("Resume Review Error:", data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-wrap gap-6 text-slate-700">
      {/* Left Card */}
      <form
        onSubmit={handleReview}
        className="w-full max-w-md bg-white p-6 border border-gray-200 rounded-lg shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <Upload className="w-6 text-[#4A7AFF]" />
          <h2 className="text-xl font-semibold">Resume Review</h2>
        </div>

        <p className="text-sm text-gray-600 mb-2">Upload Resume</p>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded-md text-sm p-2"
        />
        <p className="text-xs text-gray-400 mt-2">
          Supports PDF resume only.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm px-4 py-2 rounded-md mt-5 transition-all disabled:opacity-70"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Sparkles className="w-4" />
          )}
          {loading ? "Analyzing..." : "Review Resume"}
        </button>
      </form>

      {/* Right Card */}
      <div className="flex-1 min-w-[300px] bg-white p-6 border border-gray-200 rounded-lg flex flex-col items-center justify-start text-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-[#4A7AFF]" />
          <h3 className="text-lg font-medium">Analysis Results</h3>
        </div>

        {content ? (
          <div className="text-sm text-gray-700 whitespace-pre-line text-left w-full border-t pt-3">
            <Markdown>{content}</Markdown>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center text-gray-400 mt-10">
            <FileText className="w-10 h-10 mb-3" />
            <p className="text-sm text-center px-4">
              Upload a resume and click “Review Resume” to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
