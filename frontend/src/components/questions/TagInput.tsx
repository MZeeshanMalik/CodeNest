import React, { useState, useRef, useEffect, useCallback } from "react";

interface TagInputProps {
  tags?: string[];
  setTags?: React.Dispatch<React.SetStateAction<string[]>>;
  initialTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  tags = [],
  setTags,
  initialTags,
  onTagsChange,
  label = "Add Tags",
  placeholder = "Type & press Enter...",
  className = "",
}) => {
  const maxTags = 10;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [localTags, setLocalTags] = useState<string[]>(
    initialTags || tags || []
  );

  // Update local state when initialTags prop changes (only for controlled components)
  useEffect(() => {
    if (initialTags !== undefined) {
      setLocalTags(initialTags);
    }
  }, [initialTags]);

  // Notify parent of changes
  const updateParent = useCallback(
    (newTags: string[]) => {
      if (onTagsChange) {
        onTagsChange(newTags);
      }
      if (setTags) {
        setTags(newTags);
      }
    },
    [onTagsChange, setTags]
  );
  // Handle removing tags
  const removeTag = useCallback(
    (index: number) => {
      setLocalTags((prevTags) => {
        const updatedTags = prevTags.filter((_, i) => i !== index);
        updateParent(updatedTags);
        return updatedTags;
      });
    },
    [updateParent]
  );
  // Handle input change
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    },
    []
  );

  // Handle adding tags
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const newTag = inputValue.trim().toLowerCase();

        if (
          newTag &&
          !localTags.includes(newTag) &&
          localTags.length < maxTags
        ) {
          const updatedTags = [...localTags, newTag];
          setLocalTags(updatedTags);
          updateParent(updatedTags);
          setInputValue(""); // Clear input after adding tag
        }
      } else if (
        event.key === "Backspace" &&
        inputValue === "" &&
        localTags.length > 0
      ) {
        removeTag(localTags.length - 1);
      }
    },
    [inputValue, localTags, maxTags, updateParent, removeTag]
  );

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

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

      <div
        className={`flex flex-wrap gap-2 p-2 border rounded-lg cursor-text min-h-[42px] transition-colors duration-200 ${
          isFocused ? "border-blue-500" : "border-gray-300"
        }`}
        onClick={focusInput}
      >
        {localTags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="ml-1 hover:text-blue-900"
            >
              ×
            </button>
          </span>
        ))}{" "}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={
            localTags.length < maxTags ? placeholder : "Max tags reached"
          }
          disabled={localTags.length >= maxTags}
          className="flex-1 outline-none bg-transparent min-w-[120px]"
        />
      </div>
    </div>
  );
};

export default TagInput;
