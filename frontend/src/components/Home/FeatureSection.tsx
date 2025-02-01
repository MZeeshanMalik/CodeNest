"use client";
import React from "react";
import { FaQuestionCircle, FaReply, FaUsers } from "react-icons/fa";
import { MdOutlineHowToVote } from "react-icons/md";
import { SlBadge } from "react-icons/sl";
function FeatureSection() {
  const steps = [
    {
      icon: <FaQuestionCircle className="text-blue-500 text-3xl md:text-4xl" />,
      title: "Ask a Question",
      description: "Post your question and get answers from the community.",
    },
    {
      icon: <FaReply className="text-green-500 text-3xl md:text-4xl" />,
      title: "Get Expert Answers",
      description: "Receive answers from experienced developers and experts.",
    },
    {
      icon: (
        <MdOutlineHowToVote className="text-green-500 text-3xl md:text-4xl" />
      ),
      title: "Vote for best answer",
      description: "Engage, discuss, and help others by sharing knowledge.",
    },
    {
      icon: <SlBadge className="text-yellow-500 text-3xl md:text-4xl" />,
      title: "Earn badges & reputation",
      description: "Engage, discuss, and help others by sharing knowledge.",
    },
    {
      icon: <FaUsers className="text-red-500 text-3xl md:text-4xl" />,
      title: "Join the Community",
      description: "Engage, discuss, and help others by sharing knowledge.",
    },
  ];

  return (
    <section className="py-12 px-6 md:px-16 lg:px-32 bg-gray-100">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          How It Works
        </h2>
        <p className="text-gray-600 mt-2">
          Follow these simple steps to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="p-4 bg-white rounded-full shadow-md">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold mt-4">{step.title}</h3>
            <p className="text-gray-600 mt-2 max-w-xs">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureSection;
