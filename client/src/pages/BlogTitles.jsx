import React, { useState } from "react";
import { Sparkles, Hash } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const BlogTitles = () => {
  const categories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [generatedTitles, setGeneratedTitles] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      toast.error("Please enter a keyword");
      return;
    }

    try {
      setLoading(true);
      const prompt = `Generate 5 creative blog titles about "${keyword}" in the "${selectedCategory}" category. Return only the titles, one per line.`;

      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        const titles = data.content.split("\n").filter((t) => t.trim());
        setGeneratedTitles(titles);
        toast.success("Titles generated successfully");
      } else {
        toast.error(data.message || "Failed to generate titles");
      }
    } catch (error) {
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
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">AI Title Generator</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Keyword</p>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="e.g. Artificial Intelligence in Education"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          required
        />

        <p className="mt-4 text-sm font-medium">Category</p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {categories.map((cat, index) => (
            <span
              key={index}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedCategory === cat
                  ? "bg-purple-50 text-purple-700 border-purple-400"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#8A2BE2] to-[#BA68C8] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Hash className="w-5" />
          )}
          Generate Titles
        </button>
      </form>

      {/* Right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#8A2BE2]" />
          <h1 className="text-xl font-semibold">Generated Titles</h1>
        </div>

        <div className="flex-1 overflow-y-auto mt-4">
          {generatedTitles.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              {generatedTitles.map((title, index) => (
                <li key={index}>{title}</li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
              <Hash className="w-9 h-9" />
              <p>Enter a topic and click “Generate Titles” to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogTitles;
