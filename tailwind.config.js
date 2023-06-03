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
    colors: {
      primary: '#1C1E53',
      accent: '#ffff',
      warning: '#FF9119',
      'footer-primary': '#f7f7f7'
    },
    fontSize: {
      sm: ['14px', '1.25rem'],
      base: ['16px', '1.25rem'],
      lg: ['20px', '1.25rem'],
      xl: ['24px', '1.25rem'],
      header: ['1rem', '1.25rem'],
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

