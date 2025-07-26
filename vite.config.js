import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  root: 'src',
  resolve: {
    alias: {
      assets: '/assets',
      components: '/components',
      lib: '/lib',
      styles: '/styles',
    },
  },
  plugins: [react()],
})
