import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  clearScreen: false,
  server: {
    strictPort: true,
  },
  envPrefix: ['VITE_', 'AS_'],
  build: {
    minify: true,
    chunkSizeWarningLimit: 4096,
  }
})
