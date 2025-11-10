/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-red': '#dc2626',
        'cyber-blue': '#2563eb',
        'cyber-green': '#16a34a',
        'cyber-yellow': '#eab308',
        'cyber-gray': '#374151',
      }
    },
  },
  plugins: [],
}


