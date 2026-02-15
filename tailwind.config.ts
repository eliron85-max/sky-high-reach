import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
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
        "hero-dark": "hsl(var(--hero-dark))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
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
          border: "hsl(var(--card-border))",
        },
      },
      fontFamily: {
        sans: ['Ploni', 'Rubik', 'Heebo', 'sans-serif'],
        heebo: ['Heebo', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
        ploni: ['Ploni', 'Rubik', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        card: "var(--radius-card)",
        button: "var(--radius-button)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        button: "var(--shadow-button)",
      },
      spacing: {
        section: "3rem",
        "section-lg": "4rem",
        /* Header offset utilities - use pt-header-offset and lg:pt-header-offset-lg */
        "header-offset": "var(--header-offset-mobile)",
        "header-offset-lg": "var(--header-offset-desktop)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.3), 0 0 30px rgba(255, 255, 255, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 25px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.2)",
          },
        },
        "shimmer-line": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(400%)" },
        },
        "wing-flap": {
          "0%, 100%": { transform: "rotateY(0deg) scale(1)" },
          "15%": { transform: "rotateY(12deg) scale(1.05)" },
          "30%": { transform: "rotateY(-10deg) scale(1.03)" },
          "45%": { transform: "rotateY(8deg) scale(1.04)" },
          "60%": { transform: "rotateY(-6deg) scale(1.02)" },
          "75%": { transform: "rotateY(4deg) scale(1.01)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow": "glow 2s ease-in-out infinite",
        "wing-flap": "wing-flap 0.8s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
