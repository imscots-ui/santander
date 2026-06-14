import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), viteSingleFile({ removeViteModuleLoader: true, useRecommendedBuildConfig: true })],
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      input: 'index.html',
      output: { inlineDynamicImports: true },
    },
  },
  server: { host: true, port: 5174 },
});
