import CategoriesSection from "@/components/Home/CategoriesSection";
import FeatureSection from "@/components/Home/FeatureSection";
import Footer from "@/components/Home/Footer";
import HeorSection from "@/components/Home/HeorSection";
import Navbar from "@/components/Home/Navbar";
import TestimonialSlider from "@/components/Home/Testimonial";
import TopContribution from "@/components/Home/TopContribution";
import WhyJoinUs from "@/components/Home/WhyJoinUs";
import React from "react";

function Home() {
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
