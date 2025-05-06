// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#A78BFA',
          DEFAULT: '#7C3AED',
          dark: '#5B21B6',
        },
        accent: {
          light: '#6EE7B7',
          DEFAULT: '#10B981',
          dark: '#047857',
        },
        neutral: {
          light: '#F3F4F6',
          DEFAULT: '#E5E7EB',
          dark: '#374151',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        card: '0 4px 14px 0 rgba(0,0,0,0.10)',
      }
    },
  },
  plugins: [],
}
