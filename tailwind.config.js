/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./*.{js,jsx}", "./rafac/**/*.{js,jsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
