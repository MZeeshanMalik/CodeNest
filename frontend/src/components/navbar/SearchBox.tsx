"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { searchQuestions } from "@/lib/questionQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/UI/button";
import Link from "next/link";

interface SearchResult {
  _id: string;
  title: string;
  user: {
    name: string;
  };
}

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        console.log("Searching with query:", debouncedQuery);
        const { data } = await searchQuestions(debouncedQuery);
        console.log("Full response data:", data);
        console.log("Questions data:", data.data.questions);
        setResults(data.data.questions);
        setShowResults(true);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/questions/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder="Search questions..."
          className="w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {showResults && (query || isLoading) && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((question) => (
                <li key={question._id}>
                  <Link
                    href={`/questions/${question._id}`}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowResults(false)}
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {question.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      by {question.user.name}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : query ? (
            <div className="p-4 text-center text-gray-500">
              No questions found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
