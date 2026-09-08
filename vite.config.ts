import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/auth': { target: env.VITE_IDENTITY_API_URL || 'http://localhost:8001', changeOrigin: true },
        '/api/products': { target: env.VITE_CATALOG_API_URL || 'http://localhost:8002', changeOrigin: true },
        '/api/orders': { target: env.VITE_ORDER_API_URL || 'http://localhost:8003', changeOrigin: true },
        '/api/analytics': { target: env.VITE_ANALYTICS_API_URL || 'http://localhost:8005', changeOrigin: true },
      },
    },
  }
})
