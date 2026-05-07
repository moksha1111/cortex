/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#05060d',
          800: '#0a0c1a',
          700: '#10132a',
          600: '#171a3a',
        },
        cyan: {
          glow: '#22d3ee',
          mist: '#67e8f9',
        },
        violet: {
          glow: '#a78bfa',
          deep: '#6d28d9',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 18s linear infinite',
        'grid-flow': 'gridFlow 22s linear infinite',
      },
      keyframes: {
        gridFlow: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(40px)' },
        },
      },
    },
  },
  plugins: [],
};
