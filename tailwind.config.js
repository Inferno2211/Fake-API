/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0d12',
        'dark-blue': '#1a2238',
        'light-blue': '#4ecca3',
        'dark-gray': '#2e2e2e',
        'soft-white': '#e8f1f5',
      },
    },
  },
  plugins: [],
};
