import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isWeb = mode === 'web'
  
  const electronPlugins: Plugin[] = []
  if (!isWeb) {
    try {
      // Dynamicky importujeme electron pluginy
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
      ...electronPlugins,
    ],
    build: {
      outDir: isWeb ? 'dist-web' : 'dist',
      emptyOutDir: true,
      target: 'esnext',
      minify: true,
      rollupOptions: {
        output: {
          manualChunks: {
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
