import { nextui } from "@nextui-org/react";
import { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'noto-sans': ["var(--font-noto-sans)", "sans-serif"],
        'noto-serif': ["var(--font-noto-serif)", "serif"],
        'noto-sans-mono': ["var(--font-noto-sans-mono)", "monospace"],
        'noto-sans-sc': ["var(--font-noto-sans-sc)", "sans-serif","serif"],
        'noto-sans-kr': ["var(--font-noto-sans-kr)", "sans-serif","serif"],
        'noto-sans-jp': ["var(--font-noto-sans-jp)", "sans-serif","serif"],
      }
    },
  },
  darkMode: "class",
  plugins: [nextui(), require("@tailwindcss/typography")],
};
export default config;
