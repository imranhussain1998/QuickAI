import React, { useState } from "react";
import Markdown from "react-markdown";

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer hover:shadow transition-all duration-200"
    >
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="font-medium text-gray-800">{item.prompt || item.text}</h2>
          <p className="text-gray-500 text-xs mt-1">{item.type}</p>
          <p className="text-gray-400 text-xs">
            {new Date(item.created_at).toLocaleDateString("en-GB")}
          </p>
        </div>

        <button className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full text-xs font-medium">
          {item.type}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="mt-3">
          {item.type === "image" ? (
            <img
              src={item.content}
              alt="creation"
              className="mt-2 w-full max-w-md rounded-lg border border-gray-100"
            />
          ) : (
            <div className="mt-2 h-full overflow-y-auto text-sm text-slate-700 reset-tw prose">
              <Markdown>{item.content}</Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
