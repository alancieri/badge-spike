/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      lineHeight: {
        relaxed: '1.7',
      },
      colors: {
        border: '#e5e7eb',
      },
    },
  },
  plugins: [],
}
