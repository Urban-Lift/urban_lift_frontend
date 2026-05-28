/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          50:  '#f0faf4',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#2d9e5f',
          700: '#1a7a3c',
          800: '#155f2e',
          900: '#0f4522',
        },
        brand: {
          DEFAULT: '#1A7A3C',
          light:   '#D1FAE5',
          dark:    '#0f4522',
        },
        surface: '#F9FAFB',
        border:  '#D1D5DB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl:    '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        card:  '0 2px 8px rgba(0,0,0,0.08)',
        modal: '0 8px 32px rgba(0,0,0,0.16)',
      },
      screens: {
        xs: '390px',
      },
    },
  },
  plugins: [],
}
