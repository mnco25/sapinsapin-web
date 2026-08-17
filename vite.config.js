import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Target modern browsers for smaller, faster bundles
    target: 'es2020',
    // Enable CSS code splitting for better caching
    cssCodeSplit: true,
    // Optimize chunk splitting — Vite 8+ uses rolldown, which requires
    // manualChunks as a function rather than a static map.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor'
          }
          if (id.includes('node_modules/@number-flow')) {
            return 'number-flow'
          }
        },
      },
    },
  },
})
