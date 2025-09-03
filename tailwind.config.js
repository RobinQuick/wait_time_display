/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quick: {
          red: '#E31E24',
          'red-dark': '#B7161B',
          white: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif']
      },
      animation: {
        'float': 'float 4.5s ease-in-out infinite',
        'sweep': 'sweep 24s linear infinite',
        'panel-sweep': 'panelSweep 9s ease-in-out infinite',
        'flip': 'flipAnim 0.65s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        sweep: {
          'to': { transform: 'rotate(360deg)' }
        },
        panelSweep: {
          '0%, 10%': { transform: 'translateX(-30%) rotate(8deg)' },
          '50%': { transform: 'translateX(30%) rotate(8deg)' },
          '100%': { transform: 'translateX(-30%) rotate(8deg)' }
        },
        flipAnim: {
          '0%': { transform: 'rotateX(0) scale(1)', opacity: '1' },
          '45%': { transform: 'rotateX(-95deg) scale(0.98)', opacity: '0.25' },
          '100%': { transform: 'rotateX(0) scale(1)', opacity: '1' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 255, 255, 0.6)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
}