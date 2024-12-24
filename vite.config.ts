import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"
import { resolve } from 'path'

export default defineConfig(({ command, mode }) => {
  const isWeb = mode === 'web'
  
  const electronPlugins: Plugin[] = []
  if (!isWeb) {
    try {
      const electron = require('vite-electron-plugin')
      const { customStart } = require('vite-electron-plugin/plugin')
      const renderer = require('vite-plugin-electron-renderer')
      
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
      cssCodeSplit: false,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: isWeb ? {
          format: 'es',
          inlineDynamicImports: true
        } : {
          manualChunks: {
            react: ['react', 'react-dom'],
            lucide: ['lucide-react']
          }
        }
      }
    },
    css: {
      postcss: './postcss.config.js'
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  }
})
