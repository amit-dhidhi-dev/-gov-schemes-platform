import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generateSitemapPlugin from './sitemap-plugin.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    generateSitemapPlugin()
  ],
})
