import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Abaikan TypeScript error saat build
    emptyOutDir: true,
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      // Force rollup to ignore TypeScript errors
      onwarn(warning, warn) {
        if (warning.code === 'TS_ERROR') return;
        warn(warning);
      }
    }
  }
})