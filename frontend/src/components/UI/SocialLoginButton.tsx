// SocialLoginButton.tsx
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

interface SocialLoginButtonProps {
  provider: "google" | "github";
  onClick: () => void;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  onClick,
}) => {
  const icon =
    provider === "google" ? (
      <FcGoogle className="w-6 h-6" />
    ) : (
      <FaGithub className="w-6 h-6" />
    );

  const text =
    provider === "google" ? "Continue with Google" : "Continue with GitHub";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center justify-center w-full px-6 py-3 space-x-2 font-semibold text-black bg-${
        provider === "google" ? "geen-700" : "gray-200"
      } rounded-lg shadow-md hover:bg-${
        provider === "google" ? "blue-700" : "gray-900"
      } transition-colors duration-200`}
    >
      {icon}
      <span>{text}</span>
    </motion.button>
  );
};

export default SocialLoginButton;
