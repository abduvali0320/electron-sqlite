import path, { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@lib': resolve('src/main/lib'),
        '@shared': resolve('src/shared')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    assetsInclude: './src/renderer/src/assets/**',
    resolve: {
      alias: {
        '@app': path.resolve(__dirname, './src/renderer/src/app'),
        '@pages': path.resolve(__dirname, './src/renderer/src/pages'),
        '@widgets': path.resolve(__dirname, './src/renderer/src/widgets'),
        '@features': path.resolve(__dirname, './src/renderer/src/features'),
        '@entities': path.resolve(__dirname, './src/renderer/src/entities'),
        '@shared': path.resolve(__dirname, './src/renderer/src/shared')
      }
    },
    plugins: [react()]
  }
})
