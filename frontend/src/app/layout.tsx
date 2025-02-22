"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import "../styles/editor.css";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import { useState } from "react";
import { Toaster } from "@/components/UI/toaster";
import { AuthProvider } from "@/services/AuthProvider";
import { MantineProvider } from "@mantine/core";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Code Nest",
//   description:
//     "Code Nest is a platform for developers to share their knowledge and insights with the community.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <MantineProvider>
            <AuthProvider>
              <Navbar />
              <Toaster />
              {children}
              <Footer />
            </AuthProvider>
            <ReactQueryDevtools initialIsOpen={false} /> {/* Debugging Tool */}
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
