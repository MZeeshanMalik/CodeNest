"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Alice Johnson",
    role: "Full Stack Developer",
    text: "This platform transformed my coding journey! The community is incredibly helpful, and I learned so much.",
    image: "/profile/pic3.jpg",
  },
  {
    name: "Michael Lee",
    role: "Software Engineer",
    text: "I love the ability to ask and answer questions. The reputation system is a great motivator!",
    image: "/profile/pic1.jpg",
  },
  {
    name: "Sophia Carter",
    role: "Backend Developer",
    text: "The best place to get reliable answers from experienced developers. Highly recommended!",
    image: "/profile/pic2.jpg",
  },
  {
    name: "David Wilson",
    role: "DevOps Engineer",
    text: "The upvoting system helps surface the best solutions, making learning so much easier.",
    image: "/profile/pic3.jpg",
  },
];

// Duplicate testimonials for smooth infinite scrolling
const duplicatedTestimonials = [...testimonials, ...testimonials];

function TestimonialSlider() {
  return (
    <section className="relative bg-gray-100 py-12 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          ✨ What Developers Say
        </h2>
        <p className="text-gray-600 mt-2">
          Hear from our amazing community members.
        </p>
      </div>

      {/* Gradient Fading Effect */}
      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-gray-100 to-transparent z-10"></div>
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-gray-100 to-transparent z-10"></div>

      {/* Infinite Scrolling Testimonials */}
      <div className="mt-8 flex overflow-hidden relative">
        <motion.div
          className="flex gap-8 min-w-max"
          animate={{ x: ["0%", "-50%"] }} // Moves continuously without a reset
          transition={{
            repeat: Infinity,
            duration: 60, // Adjust speed
            ease: "linear",
          }}
          whileHover={{ animationPlayState: "paused" }} // Pause on hover
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="w-80 bg-white p-6 rounded-lg shadow-md flex-shrink-0 hover:scale-105 transition-transform duration-300"
            >
              <p className="text-gray-700 text-lg">"{testimonial.text}"</p>
              <div className="flex items-center mt-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-gray-300 object-cover"
                  width={48}
                  height={48}
                />
                <div className="ml-3">
                  <h3 className="text-md font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default TestimonialSlider;
