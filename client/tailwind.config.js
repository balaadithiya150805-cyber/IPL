/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cricket: {
          dark: '#0a0f1d',
          card: '#131b2e',
          cardHover: '#1c2742',
          gold: '#f59e0b',
          goldLight: '#fbbf24',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          sold: '#10b981',
          unsold: '#ef4444'
        },
        ipl: {
          csk: '#fdb913',
          mi: '#004ba0',
          rcb: '#ec1c24',
          kkr: '#3a225d',
          rr: '#ea1a85',
          srh: '#ff822a',
          dc: '#0078bc',
          pbks: '#dc2626',
          gt: '#1c2841',
          lsg: '#00b8e6'
        }
      },
      fontFamily: {
        display: ['Outfit', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'bounce-short': 'bounceShort 0.5s ease-in-out infinite',
        'gavel': 'gavelStrike 0.6s ease-in-out forwards'
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(245, 158, 11, 0.8), 0 0 40px rgba(6, 182, 212, 0.4)' }
        },
        bounceShort: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        gavelStrike: {
          '0%': { transform: 'rotate(-45deg)', transformOrigin: 'bottom left' },
          '50%': { transform: 'rotate(15deg)', transformOrigin: 'bottom left' },
          '100%': { transform: 'rotate(0deg)', transformOrigin: 'bottom left' }
        }
      }
    },
  },
  plugins: [],
}
