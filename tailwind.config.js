/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Scan all source files for Tailwind classes
  ],
  theme: {
    extend: {
      fontFamily: {
        body: [
          'var(--font-body)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        heading: [
          'var(--font-heading)',
          'ui-serif',
          'Georgia',
          'Cambria',
          '"Times New Roman"',
          'Times',
          'serif',
        ],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
    },
  },
  plugins: [],
};
