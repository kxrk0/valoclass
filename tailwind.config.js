/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        valorant: {
          red: '#ff4654',
          dark: '#0f1419',
          light: '#ece8e1',
          accent: '#f0db4f',
          green: '#00c897',
          blue: '#1e3a8a',
          purple: '#7c3aed',
          cyan: '#06b6d4',
          orange: '#f97316',
          pink: '#ec4899',
          emerald: '#10b981',
          indigo: '#6366f1',
        },
        neon: {
          red: '#ff073a',
          blue: '#00d9ff',
          green: '#39ff14',
          purple: '#bf00ff',
          yellow: '#ffff00',
          cyan: '#00ffff',
        },
        background: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          card: 'var(--bg-card)',
          overlay: 'var(--bg-overlay)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        glass: {
          bg: 'var(--glass-bg)',
          border: 'var(--glass-border)',
          strong: 'var(--glass-strong)',
          subtle: 'var(--glass-subtle)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Rajdhani', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'pulse-slow': 'pulse 3s infinite',
        'gradient-shift': 'gradientShift 4s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 20s linear infinite',
        'slow-spin': 'rotateSlow 20s linear infinite',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'text-glow': 'textGlow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-in': 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'gradient-x': 'gradientShift 3s ease infinite',
        'particle-flow': 'particleFlow 4s ease-in-out infinite',
        'data-flow': 'dataFlow 2s ease-in-out infinite',
        'pulse-stats': 'pulseStats 2s ease-in-out infinite',
        'network-pulse': 'networkPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px var(--valorant-red)' },
          '50%': { boxShadow: '0 0 20px var(--valorant-red), 0 0 30px var(--valorant-accent)' },
        },
        rotateSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        neonPulse: {
          '0%, 100%': { filter: 'brightness(1) saturate(1)' },
          '50%': { filter: 'brightness(1.2) saturate(1.5)' },
        },
        textGlow: {
          from: { textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor' },
          to: { textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3) translateY(100px)' },
          '50%': { opacity: '1', transform: 'scale(1.1) translateY(-10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        shrink: {
          from: { width: '100%' },
          to: { width: '0%' },
        },
        particleFlow: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)', opacity: '0', scale: '0.5' },
          '25%': { opacity: '1', scale: '1' },
          '75%': { opacity: '1', scale: '0.8' },
          '100%': { transform: 'translate(100px, -100px) rotate(360deg)', opacity: '0', scale: '0.3' },
        },
        dataFlow: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(20px)', opacity: '0' },
        },
        pulseStats: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        networkPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(157, 78, 221, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(157, 78, 221, 0.6)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 70, 84, 0.4)',
        'glow-accent': '0 0 20px rgba(240, 219, 79, 0.4)',
        'glow-blue': '0 0 20px rgba(30, 58, 138, 0.4)',
        'glow-green': '0 0 20px rgba(0, 200, 151, 0.4)',
        'glow-purple': '0 0 20px rgba(124, 58, 237, 0.4)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.4)',
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 20px currentColor',
        'neon-strong': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor',
      },
    },
  },
  plugins: [],
}