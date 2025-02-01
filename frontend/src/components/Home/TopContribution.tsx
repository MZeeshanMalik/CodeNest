"use client";
import Image from "next/image";
import React from "react";

function TopContribution() {
  const contributors = [
    {
      name: "John Doe",
      username: "@johndoe",
      reputation: 12500,
      answers: 120,
      badges: { gold: 3, silver: 5, bronze: 10 },
      image: "/profile/pic1.jpg",
    },
    {
      name: "Jane Smith",
      username: "@janesmith",
      reputation: 9800,
      answers: 95,
      badges: { gold: 2, silver: 7, bronze: 8 },
      image: "/profile/pic2.jpg",
    },
    {
      name: "Alex Johnson",
      username: "@alexj",
      reputation: 8700,
      answers: 85,
      badges: { gold: 1, silver: 4, bronze: 6 },
      image: "/profile/pic3.jpg",
    },
  ];

  return (
    <section className="bg-gray-200 py-12">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          🏆 Top Contributors This Month
        </h2>
        <p className="text-gray-600 mt-2">
          Recognizing the best minds in our community.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-6">
        {contributors.map((user, index) => (
          <div
            key={index}
            className={`bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-64 ${
              index === 0 ? "border-4 border-green-500" : ""
            }`}
          >
            <Image
              src={user.image}
              alt={user.name}
              className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover aspect-square"
              width={80}
              height={80}
            />
            <h3 className="mt-3 text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.username}</p>
            <p className="mt-2 text-sm text-gray-700">
              ⭐ Reputation: {user.reputation}
            </p>
            <p className="text-sm text-gray-700">✅ Answers: {user.answers}</p>
            <p className="text-sm mt-2">
              🏅 Badges: 🥇 {user.badges.gold} 🥈 {user.badges.silver} 🥉{" "}
              {user.badges.bronze}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <a
          href="/contributors"
          className="text-btnColor font-semibold hover:underline"
        >
          View All Contributors →
        </a>
      </div>
    </section>
  );
}

export default TopContribution;
