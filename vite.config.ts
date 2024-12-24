import { defineConfig } from 'vite'
import electron from 'vite-electron-plugin'
import { customStart } from 'vite-electron-plugin/plugin'
import renderer from 'vite-plugin-electron-renderer'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isWeb = process.env.BUILD_TARGET === 'web'
  
  return {
    base: isWeb ? '/text2image-prompt-editor/' : './',
    plugins: [
      react(),
      ...(!isWeb ? [
        electron({
          include: ['electron'],
          transformOptions: {
            sourcemap: command === 'serve',
          },
          plugins: [
            customStart(),
          ],
        }),
        renderer(),
      ] : []),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  }
})
