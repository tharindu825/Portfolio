import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'vendor-motion': ['framer-motion'],
          'vendor-react': ['react', 'react-dom'],
          'vendor-lucide': ['lucide-react'],
          'vendor-utils': ['axios', 'react-hot-toast'],
        }
      }
    }
  }
})

