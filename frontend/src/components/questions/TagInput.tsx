import React, { useState } from "react";

const TagInput = () => {
  const [tags, setTags] = useState<string[]>([]);
  const maxTags = 10;

  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const newTag = event.currentTarget.value.trim();

      if (newTag && !tags.includes(newTag) && tags.length < maxTags) {
        setTags([...tags, newTag]);
        event.currentTarget.value = ""; // Clear input field
      }
    }
  };

  const removeTag = (index: number) => {
    if (tags.length > 0) {
      setTags(tags.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="p-5 max-w-md md:min-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-lg font-medium text-gray-800 mb-3">Add Tags</h2>

      {/* Tag Input Field */}
      <div className="border border-gray-300 rounded-lg p-2 flex flex-wrap items-center gap-2 min-h-[50px]">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-pink-500 text-white px-3 py-1 rounded-md text-sm font-medium"
          >
            {tag}
            <button
              onClick={() => removeTag(index)}
              className="ml-2 text-white text-xs font-bold px-1.5 py-0.5 rounded-md bg-red-500 hover:bg-red-600 transition"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Input Field */}
        {tags.length < maxTags && (
          <input
            type="text"
            onKeyDown={addTag}
            placeholder="Type & press Enter..."
            className="flex-1 text-sm text-gray-700 outline-none border-none bg-transparent"
          />
        )}
      </div>

      {/* Tag Count Info */}
      <p className="text-gray-500 text-xs mt-2">
        {tags.length} / {maxTags} tags added
      </p>
    </div>
  );
};

export default TagInput;
