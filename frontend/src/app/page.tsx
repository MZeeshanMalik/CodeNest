"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import React, { useEffect } from "react";
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
      <TokenHandler />
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
