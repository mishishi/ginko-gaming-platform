import type { Config } from 'tailwindcss'

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
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'serif'],
        sans: ['Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
