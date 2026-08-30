import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#dbe5f2',
          200: '#b8cde5',
          300: '#8baed5',
          400: '#5a89c1',
          500: '#3a69a7',
          600: '#2a508b',
          700: '#1b365d',
          800: '#183052',
          900: '#0f223d',
        },
        gold: {
          50: '#fdfbf4',
          100: '#f9f3df',
          200: '#f2e5bb',
          300: '#e7d28d',
          400: '#daba59',
          500: '#c5a059',
          600: '#d4af37',
          700: '#b8860b',
          800: '#755416',
        },
        dusty: {
          50: '#f4f7fb',
          100: '#e5ecf5',
          200: '#cbd8eb',
          300: '#a3b8d7',
          400: '#6b8ab9',
          500: '#4b6e9f',
        },
      },
      fontFamily: {
        script: ['var(--font-script)', 'cursive'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
