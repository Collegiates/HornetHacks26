/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#fdfbf7",
        ink: "#4b3528",
        slate: "#8b6f5a",
        mist: "#efe5d8",
        seafoam: {
          50: "#fdf3ec",
          100: "#f8dfd0",
          300: "#e9b287",
          400: "#d98f62",
          500: "#c6713d",
          600: "#9d542d",
        },
        amber: {
          50: "#fff8eb",
          100: "#f9ebc8",
          300: "#e7c174",
          500: "#c99639",
        },
      },
      boxShadow: {
        card: "0 24px 60px rgba(94, 67, 47, 0.10)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        "soft-radial":
          "radial-gradient(circle at top left, rgba(228, 189, 151, 0.28), transparent 36%), radial-gradient(circle at bottom right, rgba(199, 113, 61, 0.12), transparent 24%)",
      },
    },
  },
  plugins: [],
};
