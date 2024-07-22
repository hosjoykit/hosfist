/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'xs': '0px',
      'sm': '600px',
      'md': '960px',
      'lg': '1280px',
      'xl': '1920px',
      'xxl': '2560px',
    }
  },
  plugins: [],
}
