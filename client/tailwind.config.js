/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0F0F0F',
          secondary: '#1A1A1A',
          tertiary: '#252525',
          card: '#1F1F1F',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A0A0A0',
          muted: '#666666',
        },
        accent: {
          lime: '#C4F233',
          limeHover: '#D4FF4D',
          limeMuted: 'rgba(196, 242, 51, 0.15)',
        },
        status: {
          positive: '#10B981',
          negative: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
          neutral: '#6B7280',
        },
        chart: {
          primary: '#C4F233',
          secondary: '#8B5CF6',
          tertiary: '#06B6D4',
          quaternary: '#EC4899',
        },
        ui: {
          border: 'rgba(255, 255, 255, 0.08)',
          borderSubtle: 'rgba(255, 255, 255, 0.04)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display': '3.5rem',
        'financial': '1.25rem',
      },
      borderRadius: {
        'card': '16px',
      },
      boxShadow: {
        'card': '0 4px 16px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.4)',
        'lime': '0 4px 12px rgba(196, 242, 51, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.4s ease',
        'scale-in': 'scaleIn 0.2s ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
