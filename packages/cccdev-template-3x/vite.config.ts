import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [preact()],
  base: '/devtools/',
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'CCDevTools',
      formats: ['iife'],
      fileName: () => 'assets/index.js',
    },
    outDir: 'template/devtools',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
