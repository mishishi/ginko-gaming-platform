import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0d0f',
        'bg-secondary': '#12161a',
        'bg-card': '#1a1f24',
        'accent-amber': '#d4a574',
        'accent-green': '#4a5c4f',
        'text-primary': '#e8e4df',
        'text-secondary': '#8a8680',
        'glow-idol': '#ff9ecf',
        'glow-quiz': '#00f5ff',
        'glow-fate': '#b8945f',
        'late-green': '#22c55e',
        'late-yellow': '#eab308',
        'late-red': '#ef4444',
        'late-gray': '#6b7280',
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'serif'],
        sans: ['Noto Sans SC', 'sans-serif'],
      },
      keyframes: {
        pulseOnce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
      },
      animation: {
        pulseOnce: 'pulseOnce 0.3s',
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => addVariant('active', '&:active')),
  ],
}
export default config
