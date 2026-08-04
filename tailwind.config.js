/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          bg: 'var(--bg)',
          yellow: 'var(--yellow)',
          pink: 'var(--pink)',
          blue: 'var(--blue)',
        }
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow)',
        'lg': 'var(--shadow-lg)',
      },
      borderWidth: {
        '3': '3px',
      },
      borderRadius: {
        'none': '0', // Explicitly reinforcing your --radius: 0
      }
    },
  },
  plugins: [],
}