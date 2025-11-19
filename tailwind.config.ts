import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional black/white/gray palette
        background: "#ffffff",
        surface: "#f9fafb", // gray-50
        primary: {
          DEFAULT: "#000000", // Pure black for CTAs
          light: "#374151", // gray-700
        },
        text: {
          DEFAULT: "#000000", // Black for headings
          muted: "#6b7280", // gray-500
        },
        border: "#e5e7eb", // gray-200
        accent: "#111827", // gray-900 for hover states
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
