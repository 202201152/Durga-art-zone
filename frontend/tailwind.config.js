/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef9f3',
          100: '#fdf2e7',
          200: '#fae4d0',
          300: '#f6ceb0',
          400: '#f1b085',
          500: '#d4a574', // Light brown/tan for buttons
          600: '#c49560',
          700: '#b8854c',
          800: '#a87538',
          900: '#8f6530',
        },
        tan: {
          50: '#faf8f5',
          100: '#f5f0eb',
          200: '#ebe1d7',
          300: '#d4c4b0',
          400: '#c4ae94',
          500: '#b3987a', // Primary tan color
        },
        secondary: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}


