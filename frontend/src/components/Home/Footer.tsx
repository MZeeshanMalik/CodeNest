"use client";
import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1 - About */}
        <div>
          <h2 className="text-white text-xl font-semibold">
            <span className="text-btnHoverCol">Code</span>
            <span>Nest</span>
          </h2>
          <p className="mt-2 text-sm">
            A developer community where you can ask questions, share knowledge,
            and connect with experts. Join us to level up your coding journey!
          </p>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h3 className="text-white text-lg font-medium mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/about" className="hover:text-btnHoverCol">
                About Us
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:text-btnHoverCol">
                FAQ
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-btnHoverCol">
                Contact
              </a>
            </li>
            <li>
              <a href="/careers" className="hover:text-btnHoverCol">
                Careers
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:text-btnHoverCol">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 - Categories */}
        <div>
          <h3 className="text-white text-lg font-medium mb-3">
            Popular Categories
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/categories/frontend" className="hover:text-btnHoverCol">
                Frontend Development
              </a>
            </li>
            <li>
              <a href="/categories/backend" className="hover:text-btnHoverCol">
                Backend Development
              </a>
            </li>
            <li>
              <a href="/categories/devops" className="hover:text-btnHoverCol">
                DevOps & Cloud
              </a>
            </li>
            <li>
              <a href="/categories/ai" className="hover:text-btnHoverCol">
                Artificial Intelligence
              </a>
            </li>
            <li>
              <a href="/categories/security" className="hover:text-btnHoverCol">
                Cyber Security
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4 - Newsletter */}
        <div>
          <h3 className="text-white text-lg font-medium mb-3">
            📬 Subscribe to Our Newsletter
          </h3>
          <p className="text-sm mb-3">
            Get the latest updates, tutorials, and community news directly in
            your inbox.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 rounded-l bg-gray-800 border border-gray-600 text-white text-sm"
            />
            <button className="px-4 py-2 bg-btnColor hover:bg-btnHoverCol rounded-r text-white text-sm font-medium">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-6 mx-6"></div>

      {/* Bottom Section */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm">
        <p>&copy; {new Date().getFullYear()} CodeNest All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="/privacy-policy" className="hover:text-btnHoverCol">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-btnHoverCol">
            Terms of Service
          </a>
        </div>
        {/* Social Media */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-gray-400 hover:text-btnColor">
            <FaFacebookF />
          </a>
          <a href="#" className="text-gray-400 hover:text-btnColor">
            <FaTwitter />
          </a>
          <a href="#" className="text-gray-400 hover:text-btnColor">
            <FaLinkedinIn />
          </a>
          <a href="#" className="text-gray-400 hover:text-btnColor">
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
