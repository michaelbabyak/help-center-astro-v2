import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://help.poppyflowers.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    mdx(),
    react(),
    tailwind(),
  ],
});
