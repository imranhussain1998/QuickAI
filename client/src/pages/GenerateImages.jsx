import React, { useState } from "react";
import { ImagePlus, Sparkles } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const GenerateImages = () => {
  const imageStyles = [
    "Realistic",
    "Ghibli style",
    "Anime style",
    "Cartoon style",
    "Fantasy style",
    "3D style",
    "Portrait style",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  // ✅ same pattern as WriteArticle and BlogTitles
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error("Please enter a description");
      return;
    }

    try {
      setLoading(true);
      const prompt = `Generate a ${selectedStyle.toLowerCase()} image of: ${input}`;

      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      console.log(data);
      if (data.success) {
        setContent(data.content);
        toast.success("Image generated successfully!");
      } else {
        toast.error(data.message || "Failed to generate image");
        console.log(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-green-500" />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Describe Your Image</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe what you want to see in the image..."
          rows="4"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:border-green-400"
          required
        />

        <p className="mt-4 text-sm font-medium">Select Style</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {imageStyles.map((style, index) => (
            <span
              key={index}
              onClick={() => setSelectedStyle(style)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedStyle === style
                  ? "bg-green-50 text-green-700 border-green-400"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {style}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-5">
          <input
            type="checkbox"
            id="public"
            checked={publish}
            onChange={() => setPublish(!publish)}
            className="accent-green-500"
          />
          <label htmlFor="public" className="text-sm text-gray-600">
            Make this image public
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer transition disabled:opacity-70"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <ImagePlus className="w-5" />
          )}
          Generate Image
        </button>
      </form>

      {/* Right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 shadow-sm min-h-96 items-center justify-center">
        <div className="flex items-center gap-3 mb-4">
          <ImagePlus className="w-5 h-5 text-green-500" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>

        {content ? (
          <img
            src={content}
            alt="Generated result"
            className="rounded-lg border border-gray-200 shadow-sm w-full object-cover"
          />
        ) : (
          <div className="flex flex-col justify-center items-center text-gray-400 mt-10">
            <ImagePlus className="w-10 h-10 mb-3" />
            <p className="text-sm text-center px-4">
              Enter a description and click “Generate Image” to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImages;
