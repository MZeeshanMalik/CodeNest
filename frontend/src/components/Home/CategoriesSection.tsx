"use client";
import React from "react";

function CategoriesSection() {
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
  );
}

export default CategoriesSection;
