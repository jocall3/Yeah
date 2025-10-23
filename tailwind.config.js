import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./constants.tsx",
    "./types.ts",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"EB Garamond"', 'serif'],
        calligraphy: ['"Great Vibes"', 'cursive'],
      },
      colors: {
        'primary': 'var(--color-primary)',
        'background': 'var(--color-background)',
        'surface': 'var(--color-surface)',
        'text': {
          'primary': 'var(--color-text-primary)',
          'secondary': 'var(--color-text-secondary)',
          'on-primary': 'var(--color-text-on-primary)',
        },
        'border': 'var(--color-border)',
        'gold': '#B8860B', // DarkGoldenRod - better for watermark
      },
       boxShadow: {
        'focus-primary': '0 0 0 3px rgba(var(--color-primary-rgb), 0.4)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [
     typography,
  ],
}