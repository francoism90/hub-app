/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter Variable, ui-sans-serif, system-ui',
          {
            fontFeatureSettings: '"calt", "case", "ccmp", "cv11", "ss01"',
            fontVariationSettings: '"opsz" 32'
          }
        ],
        serif: ['Montserrat Variable, ui-serif']
      }
    }
  },
  daisyui: {
    themes: [
      {
        hub: {
          'color-scheme': 'dark',
          primary: '#39336c',
          'primary-content': '#ffffff',
          secondary: '#c16a59',
          'secondary-content': '#ffffff',
          accent: '#37cdbe',
          'accent-content': '#163835',
          neutral: '#3d4451',
          'neutral-content': '#ffffff',
          'base-100': '#ffffff',
          'base-200': '#f2f2f2',
          'base-300': '#dbcbcb',
          'base-content': '#1f2937',
          '--rounded-box': '0.250rem',
          '--rounded-btn': '0.250rem',
          '--rounded-badge': '0.250rem',
          '--animation-btn': '0',
          '--animation-input': '0',
          '--tab-radius': '0'
        }
      }
    ]
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')]
}
