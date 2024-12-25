import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'node18',
    outDir: '../dist-electron',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './main.ts',
        preload: './preload.ts'
      },
      output: {
        format: 'cjs',
        entryFileNames: '[name].js'
      },
      external: ['electron', 'path', 'fs']
    }
  }
})
