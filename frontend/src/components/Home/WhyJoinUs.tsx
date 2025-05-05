"use client";
import Image from "next/image";
import React from "react";
import * as motion from "motion/react-client";

function WhyJoinUs() {
  const sectionVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      variants={sectionVariant}
    >
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between ">
          {/* Left Side: Text Content */}
          <div className="md:w-1/2 px-6 text-center md:text-left">
            <h2 className="text-4xl font-bold text-gray-900">
              🚀 Why Join Our Developer Community?
            </h2>
            <p className="text-gray-600 mt-3 text-lg">
              Join a thriving community of developers where you can learn,
              share, and grow your technical skills. Engage with experts, gain
              reputation, and make an impact!
            </p>

            {/* Features List */}
            <ul className="mt-6 space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 text-2xl">✅</span>
                <p className="ml-3 text-gray-700 text-lg">
                  Ask and get high-quality answers from industry experts.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 text-2xl">👍</span>
                <p className="ml-3 text-gray-700 text-lg">
                  Upvote the best solutions and help others discover valuable
                  insights.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 text-2xl">🏅</span>
                <p className="ml-3 text-gray-700 text-lg">
                  Earn reputation points and collect badges for your
                  contributions.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 text-2xl">💼</span>
                <p className="ml-3 text-gray-700 text-lg">
                  Build a strong developer profile that showcases your
                  expertise.
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 text-2xl">🌎</span>
                <p className="ml-3 text-gray-700 text-lg">
                  Connect with like-minded developers from around the world.
                </p>
              </li>
            </ul>

            {/* CTA Button */}
            <div className="mt-8">
              <a
                href="/signup"
                className="bg-btnColor text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-btnHoverCol transition"
              >
                Sign Up Now →
              </a>
            </div>
          </div>

          {/* Right Side: Illustration / Image */}
          <div className="md:w-1/2 flex justify-center mt-10 md:mt-0 flex-col  center">
            <Image
              src="community.svg"
              alt="Join the Developer Community"
              className="w-3/4 md:w-full max-w-sm"
              width={500}
              height={500}
            />
            <Image
              src="team.svg"
              alt="Join the Developer Community"
              className="w-3/4 md:w-full max-w-sm"
              width={500}
              height={500}
            />
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default WhyJoinUs;
