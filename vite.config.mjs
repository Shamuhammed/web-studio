import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

/** file:// не умеет ES-модули и CORS — отдаём классический скрипт без crossorigin. */
function fileProtocolHtml() {
  return {
    name: 'file-protocol-html',
    transformIndexHtml(html) {
      return html
        .replaceAll(' type="module"', '')
        .replaceAll(' crossorigin', '');
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [tailwindcss(), fileProtocolHtml()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
