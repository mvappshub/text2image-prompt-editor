import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isWeb = mode === 'web'
  
  const electronPlugins: Plugin[] = []
  if (!isWeb) {
    try {
      const electron = require('vite-electron-plugin').default
      const { customStart } = require('vite-electron-plugin/plugin')
      const renderer = require('vite-plugin-electron-renderer').default
      
      electronPlugins.push(
        electron({
          include: ['electron'],
          transformOptions: {
            sourcemap: command === 'serve',
          },
          plugins: [
            customStart(),
          ],
        }),
        renderer()
      )
    } catch (e) {
      console.warn('Electron plugins not available:', e)
    }
  }
  
  return {
    base: './',
    plugins: [
      react(),
      viteSingleFile(),
      ...electronPlugins,
    ],
    build: {
      outDir: isWeb ? 'dist-web' : 'dist',
      emptyOutDir: true,
      target: 'esnext',
      minify: true,
      assetsInlineLimit: 100000000,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks: isWeb ? () => 'everything.js' : {
            react: ['react', 'react-dom'],
            lucide: ['lucide-react']
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  }
})
