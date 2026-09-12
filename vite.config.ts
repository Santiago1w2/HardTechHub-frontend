import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(),tailwindcss(),],
    server: {
      proxy: {
        '/api/auth': { target: env.VITE_IDENTITY_API_URL, changeOrigin: true },
        '/api/products': { target: env.VITE_CATALOG_API_URL,changeOrigin: true },
        '/api/orders': { target: env.VITE_ORDER_API_URL, changeOrigin: true },
        '/api/analytics': { target: env.VITE_ANALYTICS_API_URL, changeOrigin: true },
      },
    },
  }
})
