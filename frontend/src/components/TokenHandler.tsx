"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import { useAuth } from "@/services/AuthProvider"; // import your context

export default function TokenHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  //   const { login } = useAuth(); // 👈 access login function from context

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));

        // Save to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // 👇 Update context instantly
        // login(user);

        // Redirect and clean URL
        setTimeout(() => {
          router.replace("/");
          router.refresh();
        }, 3000);
      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    }
  }, [searchParams, router]);

  return null;
}
