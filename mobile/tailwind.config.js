/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#004ac6',
        'primary-container': '#2563eb',
        surface: '#f7f9fb',
        'on-surface': '#191c1e',
        'on-surface-variant': '#434655',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f2f4f6',
        outline: '#737686',
        tertiary: '#006242',
        error: '#ba1a1a',
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}