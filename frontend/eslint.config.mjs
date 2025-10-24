import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
// ];

const eslintConfig = [
  ...compat.config({
    extends: ["next"],
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",
      "@next/next/no-img-element": "off", // ✅ Disable <img> warning
      "no-unused-vars": "off", // Disable unused vars
      "no-console": "off", // Disable console warnings
      "@typescript-eslint/no-explicit-any": "off", // Disable any type errors
      "@typescript-eslint/no-unused-vars": "off", // Disable TS unused vars
    },
  }),
];

export default eslintConfig;
