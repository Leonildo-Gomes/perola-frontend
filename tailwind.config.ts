import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "#0F766E",
          light: "#F0FDFA",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          amber: "#D97706",
          light: "#FEF3C7",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          light: "#FFE4E6",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Pérola Brand & Design System Specific Tokens
        perola: {
          teal: {
            DEFAULT: "#0D9488",
            dark: "#0F766E",
            light: "#F0FDFA",
          },
          // Stitch screens: primary action / active state (#00685f) and mint badge (#CCFBF1)
          deep: {
            DEFAULT: "#00685F",
            container: "#008378",
          },
          mint: "#CCFBF1",
          gold: {
            DEFAULT: "#D97706",
            light: "#FEF3C7",
          },
          coral: {
            DEFAULT: "#E11D48",
            light: "#FFE4E6",
          },
          slate: {
            bg: "#F8FAFC",
            subtle: "#F1F5F9",
            border: "#E2E8F0",
            muted: "#64748B",
            body: "#334155",
            dark: "#0F172A",
          },
        },
        // Status Tokens according to DOMAIN.md & DESIGN.md
        status: {
          pending: {
            text: "#B45309",
            bg: "#FEF3C7",
            border: "#FDE68A",
          },
          confirmed: {
            text: "#047857",
            bg: "#D1FAE5",
            border: "#A7F3D0",
          },
          completed: {
            text: "#334155",
            bg: "#E2E8F0",
            border: "#CBD5E1",
          },
          cancelled: {
            text: "#B91C1C",
            bg: "#FFE4E6",
            border: "#FECDD3",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "sans-serif"],
        display: ["var(--font-plus-jakarta-sans)", "sans-serif"],
        accent: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

