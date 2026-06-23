/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: {
            50:  "#EAF6EE",
            300: "#7FC998",
            500: "#1B7A3D",
            600: "#156330",
            900: "#0B331A",
          },
          gold: {
            50:  "#FFF8E6",
            300: "#FFD15C",
            500: "#E8A800",
            600: "#C98F00",
          },
          blue: {
            500: "#1E5AA8",
            600: "#164581",
          },
          red: {
            500: "#C8102E",
          },
        },
        state: {
          error:   "#DC2626",
          success: "#15803D",
        },
        neutral: {
          50:  "#F8FAF8",
          200: "#E2E5E1",
          400: "#9CA3AF",
          600: "#4B5563",
          900: "#14241A",
        },
      },
      fontFamily: {
        display: ["Lexend", "sans-serif"],
        body:    ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        card: "1rem",
      },
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
    },
  },
  plugins: [],
};
