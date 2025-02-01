import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: 'src/main/index.ts' // main process uchun
      },
      {
        entry: 'src/main/preload.ts', // preload fayli
        vite: {
          build: {
            outDir: 'out/main' // preload.js bu yerda hosil bo'ladi
          }
        }
      }
    ]),
    renderer() // renderer jarayoni uchun
  ],
  build: {
    outDir: 'dist', // build chiqishi
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/main'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@renderer': path.resolve(__dirname, 'src/renderer/src'),
      '@UI': path.resolve(__dirname, 'src/renderer/src/UI'),
      '@components': path.resolve(__dirname, 'src/renderer/src/components')
    }
  }
})
