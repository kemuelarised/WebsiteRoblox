/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf7",
          100: "#dcfce9",
          200: "#bbf7d6",
          300: "#86efb6",
          400: "#3fe389",
          500: "#1dbf73",
          600: "#16a260",
          700: "#128351",
          800: "#116844",
          900: "#0f563a"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(2, 8, 23, 0.08)"
      }
    }
  },
  plugins: []
};

