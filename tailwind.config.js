/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-out': {
          '0%': { opacity: '0', transform: 'translateY(10px)' }, // Start hidden and slightly below
          '50%': { opacity: '1', transform: 'translateY(0)' }, // Fade in and move to normal position
          '100%': { opacity: '0', transform: 'translateY(-10px)' }, // Fade out and slightly above
        },
      },
      animation: {
        'fade-in-out': 'fade-in-out 1s ease-in-out', // Duration of 1 second
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
};
