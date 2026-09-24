import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    // Must run before the React plugin so generated route tree is fresh.
    tanstackRouter(),
    react(),
  ],
  build: {
    // Build straight into the Go embed directory (single source of truth);
    // empty it each build so stale hashed assets don't accumulate.
    outDir: '../api/webfs/dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})