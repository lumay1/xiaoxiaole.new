import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/xiaoxiaole.new/',
  resolve: {
    alias: {
      '/src': '/src'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
