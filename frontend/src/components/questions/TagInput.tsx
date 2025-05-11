import React, { useState, useRef, useEffect } from "react";

const TagInput = ({
  tags = [] as string[],
  setTags,
  initialTags,
  onTagsChange,
  label = "Add Tags",
  placeholder = "Type & press Enter...",
  className = "",
}: {
  tags?: string[];
  setTags?: React.Dispatch<React.SetStateAction<string[]>>;
  initialTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}) => {
  const maxTags = 10;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [localTags, setLocalTags] = useState<string[]>([]);
  // Initialize tags from props on mount and when they change
  useEffect(() => {
    console.log("TagInput initializing with:", { initialTags, tags });
    // Only set local tags if they're different from current state
    if (
      initialTags &&
      initialTags.length > 0 &&
      JSON.stringify(initialTags) !== JSON.stringify(localTags)
    ) {
      setLocalTags(initialTags);
    } else if (
      tags &&
      tags.length > 0 &&
      JSON.stringify(tags) !== JSON.stringify(localTags) &&
      !initialTags
    ) {
      setLocalTags(tags);
    }
  }, [initialTags, tags, localTags]);

  // Update parent component when tags change - but only if triggered by user action
  const notifiedRef = useRef(false);

  useEffect(() => {
    // Skip initial render or when tags are set from props
    if (localTags.length > 0 && !notifiedRef.current) {
      notifiedRef.current = true;
      return;
    }

    console.log("TagInput updating parent with localTags:", localTags);
    if (onTagsChange) {
      onTagsChange(localTags);
    }
    if (setTags) {
      setTags(localTags);
    }
  }, [localTags, onTagsChange, setTags]);
  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const newTag = event.currentTarget.value.trim();

      if (newTag && !localTags.includes(newTag) && localTags.length < maxTags) {
        setLocalTags([...localTags, newTag]);
        event.currentTarget.value = ""; // Clear input field
      }
    } else if (
      event.key === "Backspace" &&
      event.currentTarget.value === "" &&
      localTags.length > 0
    ) {
      // Remove the last tag when pressing backspace on empty input
      removeTag(localTags.length - 1);
    }
  };

  const removeTag = (index: number) => {
    if (localTags.length > 0) {
      setLocalTags(localTags.filter((_, i) => i !== index));
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };
  return (
    <div className={`bg-white rounded-lg w-full mx-auto ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <span
          className={`text-xs font-medium ${
            localTags.length >= maxTags ? "text-amber-600" : "text-gray-500"
          }`}
        >
          {localTags.length}/{maxTags}
        </span>
      </div>

      {/* Tag Input Field */}
      <div
        className={`border transition-all duration-200 rounded-md flex flex-wrap items-center gap-2 min-h-[50px] px-3 py-2 cursor-text
          ${
            isFocused
              ? "border-blue-500 ring-1 ring-blue-500/20"
              : "border-gray-300 hover:border-gray-400"
          }
          ${localTags.length >= maxTags ? "bg-gray-50" : "bg-white"}`}
        onClick={focusInput}
      >
        {localTags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-sm font-medium group transition-all duration-200 hover:bg-blue-100"
          >
            <span className="max-w-[150px] truncate">{tag}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="ml-1.5 text-blue-400 hover:text-blue-600 transition-colors p-0.5 rounded-full hover:bg-blue-200/50 group-hover:bg-blue-200/80"
              aria-label={`Remove tag ${tag}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}

        {/* Input Field */}
        {localTags.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            onKeyDown={addTag}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={localTags.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] text-sm text-gray-700 outline-none border-none bg-transparent py-1"
          />
        )}

        {localTags.length === 0 && !isFocused && (
          <span className="text-sm text-gray-400">{placeholder}</span>
        )}
      </div>

      {/* Helpful hint */}
      {localTags.length < maxTags && (
        <p className="text-gray-500 text-xs mt-1.5 flex items-center">
          <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md mr-1">
            Enter
          </kbd>
          <span>to add a tag</span>
          {localTags.length > 0 && (
            <>
              <span className="mx-1.5">•</span>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md mr-1">
                Backspace
              </kbd>
              <span>to remove last tag</span>
            </>
          )}
        </p>
      )}
    </div>
  );
};

export default TagInput;
