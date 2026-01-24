import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        abysse: "#002B49",
        turquoise: "#00A9CE",
        background: {
          light: "#F8FAFC",
          dark: "#020617"
        }
      },
      boxShadow: {
        'card': '0 20px 25px -5px rgba(0, 43, 73, 0.05), 0 8px 10px -6px rgba(0, 43, 73, 0.05)',
        'card-hover': '0 25px 50px -12px rgba(0, 43, 73, 0.15)',
      },
      borderRadius: {
        '4xl': '2.5rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};
export default config;
