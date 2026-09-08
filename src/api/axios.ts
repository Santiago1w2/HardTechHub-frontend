import axios from 'axios'

function createApi(url: string | undefined) {
    return axios.create({
        baseURL: import.meta.env.DEV ? '/' : (url?.trim() || '/'),
        timeout: 10_000,
    })
}

export const identityApi = createApi(import.meta.env.VITE_IDENTITY_API_URL)
export const catalogApi = createApi(import.meta.env.VITE_CATALOG_API_URL)
export const orderApi = createApi(import.meta.env.VITE_ORDER_API_URL)
export const analyticsApi = createApi(import.meta.env.VITE_ANALYTICS_API_URL)


export function setAccessToken(token: string | null): void {
    for (const client of [identityApi, catalogApi, orderApi, analyticsApi]) {
        if (token) client.defaults.headers.common.Authorization = `Bearer ${token}`
        else delete client.defaults.headers.common.Authorization
    }
}
