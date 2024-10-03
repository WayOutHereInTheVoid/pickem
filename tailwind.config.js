/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
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
        background: "#1A1A1A",
        foreground: "#F9F9F9",
        primary: {
          DEFAULT: "#FF6F00",
          light: "#FF9E40",
          foreground: "#1A1A1A",
        },
        secondary: {
          DEFAULT: "#CCCCCC",
          foreground: "#1A1A1A",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#CCCCCC",
          foreground: "#F9F9F9",
        },
        accent: {
          DEFAULT: "#00B8D4",
          foreground: "#1A1A1A",
        },
        popover: {
          DEFAULT: "#1A1A1A",
          foreground: "#F9F9F9",
        },
        card: {
          DEFAULT: "#1A1A1A",
          foreground: "#F9F9F9",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
        'source-sans': ['"Source Sans Pro"', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};