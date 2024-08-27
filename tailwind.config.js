/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        videoInline: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        videoSticky: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        videoInline: 'videoInline 300ms ease-in-out forwards',
        videoSticky: 'videoSticky 300ms ease-in-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
