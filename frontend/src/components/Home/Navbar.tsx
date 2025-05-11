"use client";
import { useToast } from "@/hooks/use-toast";
import { useAuthLogout } from "@/hooks/useAuth";
import { logout } from "@/lib/auth";
import { useAuth } from "@/services/AuthProvider";
import Link from "next/link";
import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useQuery } from "react-query";
// import { getQuestions } from "@/lib/api"; // Adjust the import based on your project structure
import { debounce, isError } from "lodash";
import { useGetQuestions, useSearchQuestions } from "@/hooks/useQuestion";
// import { Question } from "@/types"; // Adjust the import path based on your project structure

interface User {
  name: string;
  // Add other properties of the user object if needed
}

interface Question {
  _id: string;
  title: string;
  user: {
    name: string;
  };
  slug: string;
}

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth() as { user: User | null };
  const [isInputFocused, setIsInputFocused] = useState(false);
  // / Add this ref declaration
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Add this useEffect for click outside detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node)
      ) {
        setIsInputFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const logoutMutation = useAuthLogout();
  const { toast } = useToast();

  // Debounced search query
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  // Fetch questions based on the search query
  const { data: questions, isLoading } = useSearchQuestions(searchQuery, 1, 5);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    logout();
    toast({
      title: "Success",
      description: "✅ Logout successful!",
      variant: "success",
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Clear search results when the search input is empty
  useEffect(() => {
    if (!searchQuery) {
      setSearchQuery("");
    }
  }, [searchQuery]);

  return (
    <nav className="bg-bgPrimary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center mr-4">
            <Link href="/" className="text-xl font-bold text-gray-800">
              <span className="text-red-400">Code</span>
              <span className="text-stone-900">Nest</span>
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              href="/questions/ask"
              className="text-gray-500 hover:text-gray-700"
            >
              Questions
            </Link>
            <Link href="/tags" className="text-gray-500 hover:text-gray-700">
              Tags
            </Link>
            <Link href="/users" className="text-gray-500 hover:text-gray-700">
              Users
            </Link>
            <Link href="/contact" className="text-gray-500 hover:text-gray-700">
              contact us
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs relative">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-ringCol focus:border-ringBorderCol sm:text-sm"
                  placeholder="Search questions, tags, or users..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    debouncedSearch(e.target.value);
                  }}
                  onFocus={() => {
                    setIsInputFocused(true);
                    if (searchQuery) {
                      debouncedSearch(searchQuery);
                    }
                  }}
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Search Results Dropdown */}
              {isInputFocused && searchQuery && (
                <div
                  ref={searchResultsRef}
                  className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-md max-h-60 overflow-y-auto"
                >
                  {isLoading ? (
                    <div className="px-4 py-2 text-gray-500">Loading...</div>
                  ) : questions?.questions?.length ? (
                    questions.questions.map((question: any) => (
                      <Link
                        key={question._id}
                        href={`/questions/${question._id}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsInputFocused(false);
                          setSearchQuery("");
                          window.location.href = `/questions/${question._id}`;
                        }}
                      >
                        <h4 className="font-medium text-gray-900">
                          {question.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          by {question.user?.name}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Conditional Rendering for User State */}
          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/"
                className="text-stone-800 px-4 py-2 hover:text-gray-100 rounded-md hover:bg-btnColor "
              >
                {user?.name}
              </Link>
              <span
                onClick={handleLogout}
                className="bg-btnColor text-white px-4 py-2 rounded-md hover:bg-btnHoverCol cursor-pointer"
              >
                Logout
              </span>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="/login"
                className="text-stone-800 px-4 py-2 hover:text-gray-100 rounded-md hover:bg-btnColor "
              >
                Log in
              </a>
              <a
                href="/signup"
                className="bg-btnColor text-white px-4 py-2 rounded-md hover:bg-btnHoverCol"
              >
                Sign up
              </a>
            </div>
          )}

          {/* Mobile Menu Button and Search Button */}
          <div className="flex items-center md:hidden space-x-4">
            {/* Search Button */}
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (Hidden by default) */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pt-2 pb-4">
          <div className="relative">
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search..."
              onChange={(e) => debouncedSearch(e.target.value)}
              onFocus={() => {
                setIsInputFocused(true);
                if (searchQuery) {
                  debouncedSearch(searchQuery);
                }
              }}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Mobile Search Results Dropdown */}
          {isInputFocused && searchQuery && (
            <div
              ref={searchResultsRef}
              className="mt-1 bg-white shadow-lg rounded-md max-h-80 overflow-y-auto border border-gray-200 divide-y divide-gray-100"
            >
              {isLoading ? (
                <div className="px-4 py-3 text-gray-500 flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Searching...
                </div>
              ) : questions?.questions?.length ? (
                questions.questions.map((question: any) => (
                  <Link
                    key={question._id}
                    href={`/questions/${question._id}`}
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsInputFocused(false);
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      setTimeout(() => {
                        window.location.href = `/questions/${question._id}`;
                      }, 0);
                    }}
                  >
                    <h4 className="font-medium text-gray-900">
                      {question.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      by {question.user?.name}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500">
                  {isError(questions?.error)
                    ? "Error searching. Please try again."
                    : "No results found. Try different keywords."}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu (Hidden by default) */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 w-64 bg-white  transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="px-5 pt-4 pb-3">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-4 pt-4 pb-6 space-y-2   rounded-lg">
          {/* Navigation Links */}
          <Link
            href="/questions/ask"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-300 rounded-lg transition-all duration-200 ease-in-out bg-gray-200"
          >
            Ask Question
          </Link>
          <a
            href="/tags"
            className="block px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-200 ease-in-out"
          >
            Tags
          </a>
          <a
            href="/users"
            className="block px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-200 ease-in-out"
          >
            Users
          </a>

          {/* Conditional Rendering for User State */}
          {user ? (
            <>
              {/* User Profile Link */}
              <a
                href="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-300 rounded-lg transition-all duration-200 ease-in-out bg-gray-200"
              >
                {user?.name}
              </a>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 ease-in-out bg-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login Link */}
              <a
                href="/login"
                className="block px-4 py-2 text-gray-100 bg-btnColor hover:to-btnHoverCol rounded-lg transition-all duration-200 ease-in-out"
              >
                Log in
              </a>
              {/* Signup Link */}
              <a
                href="/signup"
                className="block px-4 py-2 text-gray-100 bg-btnColor hover:to-btnHoverCol rounded-lg transition-all duration-200 ease-in-out"
              >
                Sign up
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
