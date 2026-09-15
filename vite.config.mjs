import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // Set root to current directory
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});