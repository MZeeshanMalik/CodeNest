"use client";
import React from "react";
import { FaQuestionCircle, FaReply, FaUsers } from "react-icons/fa";
import { MdOutlineHowToVote } from "react-icons/md";
import { SlBadge } from "react-icons/sl";
import * as motion from "motion/react-client";
function FeatureSection() {
  const sectionVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-20 px-6 md:px-16 lg:px-32 bg-gradient-to-b from-white to-slate-50">
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
          How It Works
        </span>
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Simple Steps to Success
        </h2>
        <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
          Join thousands of developers getting help and sharing knowledge in our
          vibrant community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          {
            icon: (
              <FaQuestionCircle className="text-blue-500 text-3xl md:text-4xl" />
            ),
            title: "Ask a Question",
            description:
              "Post your question and get answers from the community.",
          },
          {
            icon: <FaReply className="text-green-500 text-3xl md:text-4xl" />,
            title: "Get Expert Answers",
            description:
              "Receive answers from experienced developers and experts.",
          },
          {
            icon: (
              <MdOutlineHowToVote className="text-purple-500 text-3xl md:text-4xl" />
            ),
            title: "Vote for Best Answer",
            description: "Help others by voting for the most helpful answers.",
          },
          {
            icon: <SlBadge className="text-yellow-500 text-3xl md:text-4xl" />,
            title: "Earn Badges & Reputation",
            description: "Build your reputation and unlock new privileges.",
          },
          {
            icon: <FaUsers className="text-pink-500 text-3xl md:text-4xl" />,
            title: "Join the Community",
            description: "Connect with developers from around the world.",
          },
        ].map((step, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-md mb-6 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureSection;
