/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        slideIn: 'slideIn 0.3s ease-out',
      },
    },
  },

  plugins: [],
}