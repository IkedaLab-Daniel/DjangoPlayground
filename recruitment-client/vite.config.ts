import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // Change this to your desired port
    strictPort: true, // Optional: if true, Vite will exit if the port is already in use
  },
})
