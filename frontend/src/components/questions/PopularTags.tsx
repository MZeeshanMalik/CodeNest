"use client";

import { useEffect, useState } from "react";
import { Hash } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/utils/apiRoutes";

interface PopularTagsProps {
  onTagSelect: (tag: string | null) => void;
  selectedTag: string | null;
  className?: string;
}

export default function PopularTags({
  onTagSelect,
  selectedTag,
  className = "",
}: PopularTagsProps) {
  const [tags, setTags] = useState<string[]>([
    "javascript",
    "react",
    "node.js",
    "typescript",
    "css",
    "html",
    "next.js",
    "mongodb",
    "express",
  ]);
  const [loading, setLoading] = useState(false);

  // In a real app, you would fetch popular tags from the server
  // This function is a placeholder for that functionality
  useEffect(() => {
    const fetchPopularTags = async () => {
      // This is just a placeholder - for now we'll use the default tags
      // In a real implementation, you would fetch from the server
      setLoading(true);
      try {
        // Uncomment and implement when backend support is added
        // const response = await axios.get(`${API_URL}/api/v1/question/popular-tags`);
        // if (response.data && response.data.data) {
        //   setTags(response.data.data);
        // }
      } catch (error) {
        console.error("Error fetching popular tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularTags();
  }, []);

  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden ${className}`}
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Hash className="w-5 h-5 text-blue-500 mr-2" />
          Popular Tags
        </h3>
      </div>
      <div className="p-4">
        {loading ? (
          <div className="animate-pulse space-y-2">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="h-8 bg-gray-200 rounded w-1/3 inline-block m-1"
              ></div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagSelect(tag === selectedTag ? null : tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  tag === selectedTag
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
