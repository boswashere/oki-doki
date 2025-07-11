/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f72585',
        secondary: '#720026',
        accent: '#3a0ca3',
        darkbg: '#0f0f17',
        darkgray: '#1a1a2e',
        lightgray: '#8d99ae',
        textLight: '#e0e0e0',
        textDark: '#0f0f17',
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon-pink': '0 0 10px #f72585, 0 0 40px #f72585',
        'neon-blue': '0 0 10px #3a0ca3, 0 0 40px #3a0ca3',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backgroundImage: {
        'gradient-radial-pink': 'radial-gradient(circle at center, #f72585, #720026)',
        'gradient-radial-purple': 'radial-gradient(circle at center, #3a0ca3, #720026)',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, #f72585, #3a0ca3, #720026, #f72585)',
      },
      animation: {
        'pulse-neon': 'pulse 2s infinite',
        'spin-slow': 'spin 10s linear infinite',
        'wave': 'wave 2.5s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(15deg)' },
        },
      },
    },
  },
  plugins: [],
}
