/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        concrete: '#ECEAE5',
        paper: '#F6F5F1',
        graphite: '#1A1C1E',
        coal: '#111214',
        steel: '#5C6269',
        line: '#CFCAC1',
        signal: { DEFAULT: '#FF5B1F', dark: '#D9430D' },
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
