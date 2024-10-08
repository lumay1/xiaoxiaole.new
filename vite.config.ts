import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/xiaoxiaole.new/',  // 添加这一行
  plugins: [react()],
})
