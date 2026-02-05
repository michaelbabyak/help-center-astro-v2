import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://help.poppyflowers.com',
  output: 'server',
  adapter: vercel(),
  integrations: [
    mdx(),
    react(),
    tailwind(),
  ],
});
