"use client";

import { useState } from "react";
import { Button } from "./button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SocialLoginButton from "./SocialLoginButton";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();

  const handleGoogleLogin = () => {
    router.push("/api/auth/google");
  };

  const handleGithubLogin = () => {
    router.push("/api/auth/github");
  };

  const handleEmailLogin = () => {
    router.push("/login");
    onClose();
  };

  const handleEmailSignup = () => {
    router.push("/signup");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome to CodeNest
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Join our community to start voting and engaging with other
                developers
              </p>
            </div>

            <div className="space-y-4">
              <SocialLoginButton
                provider="google"
                onClick={handleGoogleLogin}
              />
              <SocialLoginButton
                provider="github"
                onClick={handleGithubLogin}
              />
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleEmailLogin}
                className="w-full bg-btnColor hover:bg-btnColor/90 text-white"
              >
                Login with Email
              </Button>
              <Button
                onClick={handleEmailSignup}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
              >
                Create Account
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
