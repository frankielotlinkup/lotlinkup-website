import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "var(--color-ink)",
          charcoal: "var(--color-ink-charcoal)",
          soft: "var(--color-ink-soft)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          deep: "var(--color-accent-deep)",
        },
        paper: {
          DEFAULT: "var(--color-paper)",
          warm: "var(--color-paper-warm)",
          edge: "var(--color-paper-edge)",
        },
        muted: "var(--color-muted)",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
