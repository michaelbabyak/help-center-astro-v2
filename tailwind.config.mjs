/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'brand-green': '#2D5016',
        'brand-sage': '#8B9F7B',
        'brand-cream': '#FFF8F0',
        'brand-blush': '#F5E6E0',
        'brand-gold': '#C4A265',
        'brand-charcoal': '#2C2C2C',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
