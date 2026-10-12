/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fc: {
          bg: '#0a0d14',
          surface: '#111723',
          card: '#161e2e',
          cardHover: '#1c263b',
          border: '#232f45',
          borderLight: '#32425f',
          green: '#00ff87',
          greenHover: '#00e676',
          greenDark: '#033b24',
          accent: '#10b981',
          gold: '#f59e0b',
          red: '#ef4444',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          textMuted: '#94a3b8',
          textLight: '#f1f5f9'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
