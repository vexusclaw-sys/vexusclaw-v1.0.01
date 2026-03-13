import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 24px 80px -28px rgba(0, 0, 0, 0.78)"
      },
      colors: {
        mission: {
          50: "#ebf8ff",
          100: "#d4f1ff",
          200: "#afebff",
          300: "#74ddff",
          400: "#3ed4ff",
          500: "#0fb2e0",
          600: "#0b8daf",
          700: "#0f6980",
          800: "#124e60",
          900: "#123947"
        }
      }
    }
  },
  plugins: []
};

export default config;
