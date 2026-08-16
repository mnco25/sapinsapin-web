/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#FBF7F0',
        ink: '#1A1613',
        ube: '#5B3E96',
        pandan: '#7FA65C',
        coconut: '#F2E4C4',
        'night-bg': '#17130F',
        // Brightened for dark mode, darkened for text on cream — the base
        // accents alone do not clear WCAG AA at body-text sizes.
        'ube-bright': '#A98CE0',
        'ube-deep': '#432D75',
        'pandan-deep': '#4F6B33',
        'pandan-bright': '#A9CE84',
      },
      fontFamily: {
        display: ['Fraunces', 'Iowan Old Style', 'Palatino', 'Georgia', 'serif'],
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      maxWidth: {
        page: '80rem',
        prose: '44rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
