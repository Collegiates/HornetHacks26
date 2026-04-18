/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        coffee: {
          50: "hsl(var(--coffee-50))",
          100: "hsl(var(--coffee-100))",
          200: "hsl(var(--coffee-200))",
          300: "hsl(var(--coffee-300))",
          400: "hsl(var(--coffee-400))",
          500: "hsl(var(--coffee-500))",
          600: "hsl(var(--coffee-600))",
          700: "hsl(var(--coffee-700))",
          800: "hsl(var(--coffee-800))",
          900: "hsl(var(--coffee-900))",
        },
        cream: "hsl(var(--cream))",
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
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "soft-radial":
          "radial-gradient(circle at top left, rgba(228, 189, 151, 0.28), transparent 36%), radial-gradient(circle at bottom right, rgba(199, 113, 61, 0.12), transparent 24%)",
      },
    },
  },
  plugins: [],
};
