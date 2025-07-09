/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#a78bfa",
          DEFAULT: "#8b5cf6",
          dark: "#7c3aed",
        },
        secondary: {
          light: "#f5f3ff",
          DEFAULT: "#ede9fe",
          dark: "#ddd6fe",
        },
        accent: {
          light: "#fef08a",
          DEFAULT: "#facc15",
          dark: "#eab308",
        },
        neutral: {
          light: "#f5f3ff",
          DEFAULT: "#e2e8f0",
          dark: "#cbd5e1",
        },
        dark: {
          light: "#334155",
          DEFAULT: "#1e293b",
          dark: "#0f172a",
        },
      },
      spacing: {
        xs: "0.5rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "1rem",
        full: "9999px",
      },
      font: {
        heading: "'Poppins', sans-serif",
        body: "'Inter', sans-serif",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide")
  ],
};
