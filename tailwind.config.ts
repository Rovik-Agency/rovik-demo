import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem', xl: '2.5rem' } },
    extend: {
      fontFamily: {
        display: ['Inter Tight', 'Satoshi', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: '#05060A',
        paper: '#FAFAFB',
        electric: '#5B6CFF',
        violet: '#8A5CFF',
        cyan: '#67E8F9',
        graphite: '#111827'
      },
      boxShadow: {
        glow: '0 20px 70px rgba(91, 108, 255, .28)',
        glass: '0 1px 0 rgba(255,255,255,.12) inset, 0 20px 80px rgba(0,0,0,.18)'
      },
      backgroundImage: {
        'premium-radial': 'radial-gradient(circle at 20% 10%, rgba(91,108,255,.22), transparent 28%), radial-gradient(circle at 80% 0%, rgba(138,92,255,.18), transparent 28%)',
        'mesh-dark': 'linear-gradient(135deg, rgba(91,108,255,.12), rgba(138,92,255,.08), transparent 45%)'
      },
      keyframes: {
        shimmer: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
        pulseGlow: { '0%,100%': { opacity: '.65' }, '50%': { opacity: '1' } }
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite',
        pulseGlow: 'pulseGlow 2.8s ease-in-out infinite'
      }
    }
  },
  plugins: []
} satisfies Config;
