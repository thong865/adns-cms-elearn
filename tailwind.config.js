/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./resources/**/*.{edge,js,ts,jsx,tsx,vue}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    fontFamily: {
      'sans': ['Noto Sans Lao', 'sans-serif'],
    },
    extend: {},
    colors:{
      primary:'#1C1E53',
      accent:'#ffff',
      warning:'#FF9119',
      'footer-primary':'#f7f7f7'
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

