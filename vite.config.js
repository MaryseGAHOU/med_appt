import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps asset paths relative so the build deploys unchanged
// to GitHub Pages, Cloudflare Pages, Vercel or any static host.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    proxy: {
      // In development, /api calls are proxied to the local Express server.
      '/api': 'http://localhost:5000',
    },
  },
  // Vitest configuration — unit tests for components and data services
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.js',
    css: true,
  },
});
