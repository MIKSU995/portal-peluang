/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        navy: {
          950: '#060913',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
        },
        dark: {
          bg:        '#0B0F19',
          surface:   '#111827',
          card:      '#141E30',
          border:    '#1E2D45',
          hover:     '#1C2B42',
          muted:     '#2D3F57',
        },
      },
      boxShadow: {
        'card':       '0 1px 3px 0 rgba(15,23,42,.06), 0 1px 2px -1px rgba(15,23,42,.04)',
        'card-hover': '0 8px 24px -4px rgba(15,23,42,.12), 0 4px 8px -2px rgba(15,23,42,.07)',
        'card-dark':       '0 1px 3px 0 rgba(0,0,0,.4)',
        'card-dark-hover': '0 8px 24px -4px rgba(0,0,0,.55)',
        'popover': '0 20px 40px -8px rgba(15,23,42,.18), 0 8px 16px -4px rgba(15,23,42,.1)',
        'popover-dark': '0 20px 40px -8px rgba(0,0,0,.6)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
