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
        ocean: {
          surface: "var(--ocean-surface)",
          twilight: "var(--ocean-twilight)",
          midnight: "var(--ocean-midnight)",
          abyss: "var(--ocean-abyss)",
        },
        panel: "var(--bg-panel)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        accent: {
          cyan: "var(--accent-cyan)",
          green: "var(--accent-green)",
          amber: "var(--accent-amber)",
          red: "var(--accent-red)",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)"],
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
};

export default config;
