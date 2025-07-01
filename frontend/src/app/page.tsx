'use client";';
import React from "react";
import { HeorSection } from "@/components/Home/HeorSection";
import CategoriesSection from "@/components/Home/CategoriesSection";
import FeatureSection from "@/components/Home/FeatureSection";
import TestimonialSlider from "@/components/Home/Testimonial";
import TopContribution from "@/components/Home/TopContribution";
import WhyJoinUs from "@/components/Home/WhyJoinUs";
import { FaQuestionCircle, FaReply, FaUsers } from "react-icons/fa";
import { MdOutlineHowToVote } from "react-icons/md";
import { SlBadge } from "react-icons/sl";

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
