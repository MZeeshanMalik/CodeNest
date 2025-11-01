"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TokenHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));

        // Save data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // ✅ Clean the URL first
        const cleanUrl = window.location.origin + "/";
        window.history.replaceState({}, document.title, cleanUrl);

        // ✅ Then reload to reflect login
        window.location.reload();
      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    }
  }, [searchParams]);

  return null;
}
