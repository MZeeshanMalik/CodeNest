"use client";
import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HeorSection } from "@/components/Home/HeorSection";
import CategoriesSection from "@/components/Home/CategoriesSection";
import FeatureSection from "@/components/Home/FeatureSection";
import TestimonialSlider from "@/components/Home/Testimonial";
import TopContribution from "@/components/Home/TopContribution";
import WhyJoinUs from "@/components/Home/WhyJoinUs";
import TokenHandler from "@/components/TokenHandler";
function Home() {
  return (
    <div className="bg-gray-50">
      <Suspense fallback={null}>
        <TokenHandler />
      </Suspense>
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
