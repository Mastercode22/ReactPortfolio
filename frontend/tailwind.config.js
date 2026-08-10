/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#F6F7FB',
          bgSecondary: '#EEF1F6',
          card: '#FFFFFF',
          accentPrimary: '#6C63FF',
          accentSecondary: '#8B7BFF',
          textPrimary: '#1B2430',
          textSecondary: '#667085',
          border: 'rgba(255,255,255,0.7)',
        },
        dark: {
          bg: '#090B13',
          bgSecondary: '#111827',
          card: '#171E2F',
          cardElevated: '#1E293B',
          accentPrimary: '#7C5CFF',
          accentSecondary: '#5FA8FF',
          highlight: '#8B7BFF',
          textPrimary: '#F8FAFC',
          textSecondary: '#CBD5E1',
          border: 'rgba(255,255,255,0.08)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'neu-light': '8px 8px 18px rgba(0, 0, 0, 0.08), -8px -8px 18px rgba(255, 255, 255, 0.95)',
        'neu-light-sm': '4px 4px 10px rgba(0, 0, 0, 0.06), -4px -4px 10px rgba(255, 255, 255, 0.9)',
        'neu-light-pressed': 'inset 4px 4px 8px rgba(0, 0, 0, 0.08), inset -4px -4px 8px rgba(255, 255, 255, 0.95)',
        'neu-dark': '6px 6px 16px rgba(0, 0, 0, 0.45), -6px -6px 16px rgba(255, 255, 255, 0.03)',
        'neu-dark-sm': '3px 3px 8px rgba(0, 0, 0, 0.4), -3px -3px 8px rgba(255, 255, 255, 0.02)',
        'neu-dark-pressed': 'inset 3px 3px 6px rgba(0, 0, 0, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.03)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'accent-glow': '0 0 25px rgba(108, 99, 255, 0.35)',
        'accent-glow-dark': '0 0 25px rgba(124, 92, 255, 0.4)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'gradient-x': 'gradientX 8s ease infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        gradientX: {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        }
      }
    },
  },
  plugins: [],
};
