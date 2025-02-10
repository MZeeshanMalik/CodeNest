"use client";
import Link from "next/link";
import React, { useState } from "react";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

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
            <a href="/questions" className="text-gray-500 hover:text-gray-700">
              Questions
            </a>
            <a href="/tags" className="text-gray-500 hover:text-gray-700">
              Tags
            </a>
            <a href="/users" className="text-gray-500 hover:text-gray-700">
              Users
            </a>
            <Link href="/contact" className="text-gray-500 hover:text-gray-700">
              contact us
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-ringCol focus:border-ringBorderCol sm:text-sm"
                  placeholder="Search..."
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
            </div>
          </div>

          {/* User Actions (Desktop) */}
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
        </div>
      )}

      {/* Mobile Menu (Hidden by default) */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
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
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a
            href="/questions"
            className="block text-gray-500 hover:text-gray-700"
          >
            Questions
          </a>
          <a href="/tags" className="block text-gray-500 hover:text-gray-700">
            Tags
          </a>
          <a href="/users" className="block text-gray-500 hover:text-gray-700">
            Users
          </a>
          <a href="/login" className="block text-gray-500 hover:text-gray-700">
            Log in
          </a>
          <a href="/signup" className="block text-blue-500 hover:text-blue-700">
            Sign up
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
