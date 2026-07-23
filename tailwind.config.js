/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#0052FF',
          600: '#0043D6',
          700: '#0035A8',
          dark: '#09090B',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#128C7E',
        }
      },
    },
  },
  plugins: [],
};
