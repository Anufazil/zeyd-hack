export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050807', panel: '#0A100D', term: '#00FF88', muted: '#497D62', sage: '#6FA98A',
        ink: '#DCE5DF', dim: '#82948A', warn: '#FFB000', danger: '#FF4444', line: '#193126',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
