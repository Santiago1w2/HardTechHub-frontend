import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/inventory': { target: env.VITE_INVENTORY_API_URL, changeOrigin: true },
        '/api/products': {
          target: env.VITE_CATALOG_API_URL,
          changeOrigin: true,
        },
        '/api/categories': {
          target: env.VITE_CATALOG_API_URL,
          changeOrigin: true,
        },
        '/api/brands': { target: env.VITE_CATALOG_API_URL, changeOrigin: true },
        '/api/admin/products': {
          target: env.VITE_CATALOG_API_URL,
          changeOrigin: true,
        },
        '/api/admin/orders': {
          target: env.VITE_ORDER_API_URL,
          changeOrigin: true,
        },
        '/api/orders': { target: env.VITE_ORDER_API_URL, changeOrigin: true },
        '/api/compatibility': {
          target: env.VITE_COMPATIBILITY_API_URL,
          changeOrigin: true,
        },
        '/api/analytics': {
          target: env.VITE_ANALYTICS_API_URL,
          changeOrigin: true,
        },
      },
    },
  }
})
