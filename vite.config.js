import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  define: {
    global: 'globalThis',
    'process.env': {},
    'process.version': '""',
    'process.browser': true
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser'
    }
  },
  optimizeDeps: {
    exclude: ['@mysten/dapp-kit', '@mysten/sui'],
    include: ['eventemitter3', 'bech32', 'react-is'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
})
