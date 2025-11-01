"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HeorSection } from "@/components/Home/HeorSection";
import CategoriesSection from "@/components/Home/CategoriesSection";
import FeatureSection from "@/components/Home/FeatureSection";
import TestimonialSlider from "@/components/Home/Testimonial";
import TopContribution from "@/components/Home/TopContribution";
import WhyJoinUs from "@/components/Home/WhyJoinUs";

function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));

        // Save to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Remove query params (for cleaner URL)
        router.replace("/"); // or router.replace("/") if this is your main page
      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    }
  }, [searchParams, router]);

  return (
    <div className="bg-gray-50">
      <HeorSection />
      <FeatureSection />
      <TopContribution />
      <CategoriesSection />
      <WhyJoinUs />
      <TestimonialSlider />
    </div>
  );
}

export default Home;
