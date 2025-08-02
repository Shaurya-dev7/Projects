/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          50: '#fff8f1',
          100: '#feecdc',
          200: '#fcd9bd',
          300: '#fdba8c',
          400: '#ff9555',
          500: '#ff7a00',
          600: '#e85d00',
          700: '#cc5500',
          800: '#a04400',
          900: '#7c3300',
        },
        primary: '#232f3e',
        secondary: '#37475a',
        accent: '#ff9900',
      },
      fontFamily: {
        'amazon': ['Amazon Ember', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}