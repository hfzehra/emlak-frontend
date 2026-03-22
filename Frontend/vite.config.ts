import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting ve chunk optimizasyonu
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
    // Chunk size uyarılarını optimize et
    chunkSizeWarningLimit: 1000,
    // Minification - esbuild (Vite default, terser'dan daha hızlı)
    minify: 'esbuild',
    // Sourcemap production'da kapalı
    sourcemap: false,
  },
  esbuild: {
    // Production'da console ve debugger'ları kaldır
    drop: ['console', 'debugger'],
  },
  preview: {
    port: 4173,
    strictPort: false,
  },
})
