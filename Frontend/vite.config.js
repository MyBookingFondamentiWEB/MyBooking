import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  

  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      "/api" : "http://localhost:3000"     //per usare chiamate di tipo fetch
    }
  },

})
