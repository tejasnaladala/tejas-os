import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          surface: "var(--bg-surface)",
          elevated: "var(--bg-elevated)",
        },
        border: "var(--border)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        accent: {
          green: "var(--accent-green)",
          amber: "var(--accent-amber)",
          cyan: "var(--accent-cyan)",
          red: "var(--accent-red)",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)"],
        pixel: ["var(--font-pixel)"],
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
};

export default config;
