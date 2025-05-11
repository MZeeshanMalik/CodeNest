"use client";

import { useState, useRef, useEffect } from "react";
import { useQuestions } from "@/hooks/useQuestions";
import QuestionList from "@/components/Question/QuestionList";
import {
  Clock,
  ArrowUp,
  MessageSquare,
  Filter,
  SortAsc,
  Search,
  ChevronDown,
  X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/UI/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import QuestionSidebar from "@/components/questions/QuestionSidebar";
import PopularTags from "@/components/questions/PopularTags";
import { Input } from "@/components/UI/input";
import { useRouter } from "next/navigation";
import { searchQuestions } from "@/lib/questionQuery";
import { useDebounce } from "@/hooks/useDebounce";

export default function QuestionsPage() {
  const router = useRouter();
  const { questions, pagination, loading, loadMore, changeSort, filterByTag } =
    useQuestions(10);

  const [activeSort, setActiveSort] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Close search results dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Real-time search functionality
  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const data = await searchQuestions(debouncedQuery);
        setSearchResults(data.questions.slice(0, 5)); // Limit to first 5 results
        setShowSearchResults(true);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    };

    search();
  }, [debouncedQuery]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/questions/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
      setShowSearchResults(false);
    }
  };

  // Handle sort selection
  const handleSortChange = (sortOption: string) => {
    setActiveSort(sortOption);
    changeSort(sortOption);
  };

  // Handle tag filtering
  const handleTagFilter = (tag: string | null) => {
    setSelectedTag(tag);
    filterByTag(tag);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="lg:w-3/4">
          {/* Header and controls */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
                {selectedTag
                  ? `Questions tagged [${selectedTag}]`
                  : "All Questions"}
              </h1>
              <Link href="/questions/ask">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Ask Question
                </Button>
              </Link>
            </div>{" "}
            {/* Search bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative" ref={searchRef}>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  type="search"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) {
                      setShowSearchResults(true);
                    }
                  }}
                  className="pl-10 pr-10 py-2 w-full"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                      setShowSearchResults(false);
                    }}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}

                {/* Search results dropdown */}
                {showSearchResults && (searchQuery || isSearching) && (
                  <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-center text-gray-500">
                        Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <ul className="py-2">
                        {searchResults.map((question) => (
                          <li key={question._id}>
                            <Link
                              href={`/questions/${question._id}`}
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => setShowSearchResults(false)}
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
                        <li className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (searchQuery.trim()) {
                                router.push(
                                  `/questions/search?q=${encodeURIComponent(
                                    searchQuery.trim()
                                  )}`
                                );
                                setShowSearchResults(false);
                              }
                            }}
                            className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            See all results for "{searchQuery}"
                          </button>
                        </li>
                      </ul>
                    ) : searchQuery ? (
                      <div className="p-4 text-center text-gray-500">
                        No questions found
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </form>
            {/* Filters and sorting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700 mr-2">
                  {pagination?.totalQuestions ?? 0} questions
                </span>

                {selectedTag && (
                  <div className="flex items-center ml-2">
                    <span className="px-2.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full flex items-center">
                      {selectedTag}
                      <button
                        onClick={() => handleTagFilter(null)}
                        className="ml-1.5 text-blue-800 hover:text-blue-600"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <SortAsc className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">Sort by:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      {activeSort === "newest" && (
                        <Clock className="w-4 h-4 mr-1.5" />
                      )}
                      {activeSort === "votes" && (
                        <ArrowUp className="w-4 h-4 mr-1.5" />
                      )}
                      {activeSort === "answers" && (
                        <MessageSquare className="w-4 h-4 mr-1.5" />
                      )}

                      {activeSort === "newest" && "Newest"}
                      {activeSort === "votes" && "Most voted"}
                      {activeSort === "answers" && "Most answered"}

                      <ChevronDown className="w-4 h-4 ml-1.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleSortChange("newest")}
                      className={activeSort === "newest" ? "bg-blue-50" : ""}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Newest
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSortChange("votes")}
                      className={activeSort === "votes" ? "bg-blue-50" : ""}
                    >
                      <ArrowUp className="w-4 h-4 mr-2" />
                      Most voted
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSortChange("answers")}
                      className={activeSort === "answers" ? "bg-blue-50" : ""}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Most answered
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Question list */}
          <QuestionList
            questions={questions}
            loading={loading}
            hasMore={pagination?.hasNextPage || false}
            onLoadMore={loadMore}
            selectedTag={selectedTag}
            emptyStateMessage={
              selectedTag
                ? `No questions found with tag [${selectedTag}]`
                : "No questions found"
            }
          />
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/4 space-y-6">
          {/* Popular tags */}
          <PopularTags
            onTagSelect={handleTagFilter}
            selectedTag={selectedTag}
          />

          {/* Top questions sidebar */}
          <QuestionSidebar title="Top Questions" type="top" />

          {/* Random questions sidebar */}
          <QuestionSidebar title="Discover Questions" type="random" />
        </div>
      </div>
    </div>
  );
}
