import axios from 'axios'

function createApi(url: string | undefined, label: string, timeout = 15_000) {
  const target = url?.trim()
  const client = axios.create({ baseURL: import.meta.env.DEV ? '/' : target, timeout })
  client.interceptors.request.use(config => {
    if (!target) throw new Error(`Falta configurar la URL del servicio de ${label}.`)
    return config
  })
  return client
}

export const catalogApi = createApi(import.meta.env.VITE_CATALOG_API_URL, 'catálogo')
export const orderApi = createApi(import.meta.env.VITE_ORDER_API_URL, 'pedidos', 60_000)
export const inventoryApi = createApi(import.meta.env.VITE_INVENTORY_API_URL, 'inventario')
export const analyticsApi = createApi(import.meta.env.VITE_ANALYTICS_API_URL, 'analítica', 60_000)
export const compatibilityApi = createApi(import.meta.env.VITE_COMPATIBILITY_API_URL, 'compatibilidad', 45_000)
