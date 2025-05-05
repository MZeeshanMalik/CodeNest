"use client";
import React from "react";
import * as motion from "motion/react-client";

function CategoriesSection() {
  const sectionVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };
  const categories = [
    { name: "Frontend", slug: "frontend", color: "bg-blue-500" },
    { name: "Backend", slug: "backend", color: "bg-green-500" },
    { name: "DevOps", slug: "devops", color: "bg-yellow-500" },
    { name: "AI & ML", slug: "ai-ml", color: "bg-purple-500" },
    { name: "Cybersecurity", slug: "cybersecurity", color: "bg-red-500" },
    { name: "Data Science", slug: "data-science", color: "bg-indigo-500" },
    { name: "Blockchain", slug: "blockchain", color: "bg-gray-700" },
    { name: "Mobile Development", slug: "mobile-dev", color: "bg-pink-500" },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      variants={sectionVariant}
    >
      <section className="bg-gray-100 py-12">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            📌 Popular Categories
          </h2>
          <p className="text-gray-600 mt-2">
            Explore questions by category and find what interests you.
          </p>
        </div>

        {/* Category Grid */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {categories.map((category, index) => (
            <a
              key={index}
              href={`/categories/${category.slug}`}
              className={`${category.color} text-white px-5 py-2 rounded-full font-medium text-sm hover:opacity-80 transition`}
            >
              {category.name}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-6 text-center">
          <a
            href="/categories"
            className="text-btnColor font-semibold hover:underline"
          >
            Browse All Categories →
          </a>
        </div>
      </section>
    </motion.div>
  );
}

export default CategoriesSection;
