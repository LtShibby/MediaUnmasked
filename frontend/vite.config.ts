import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, 'dist'),
    sourcemap: true,
    emptyOutDir: true
  },
  base: '/' // Ensure assets are loaded from root path
}) 