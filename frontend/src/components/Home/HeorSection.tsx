import Image from "next/image";
import React from "react";

function HeorSection() {
  return (
    <section className="px-6 lg:px-16 py-16">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
        {/* Left Side (Text) */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <span className="text-gray-500 text-lg font-semibold">
            Ask Learn Build
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
            <span className="text-red-500">Your Coding</span>
            <span> Problems Solved</span>
          </h1>
          <p className="text-lg text-stone-800 mt-4">
            Stuck on a bug? Need career advice? Connect with experts and get the
            answers you need.
          </p>
          <button className="mt-6 px-6 py-3 bg-btnColor text-white font-semibold rounded-md shadow-md hover:bg-btnHoverCol transition">
            Get started today
          </button>
        </div>

        {/* Right Side (Image) */}
        <div className="lg:w-1/3 flex justify-center mt-10 lg:mt-0">
          <Image
            src="/programmer.svg"
            alt="Knowledge Sharing Illustration"
            className="max-w-full h-auto"
            width={500}
            height={500}
          />
        </div>
      </div>
    </section>
  );
}

export default HeorSection;
