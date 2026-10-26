import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // in dev, /api goes to the contact server (npm run server)
  server: { proxy: { '/api': 'http://localhost:8787' } },
})
