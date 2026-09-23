/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_INVENTORY_API_URL?: string
  readonly VITE_CATALOG_API_URL?: string
  readonly VITE_ORDER_API_URL?: string
  readonly VITE_ANALYTICS_API_URL?: string
  readonly VITE_COMPATIBILITY_API_URL?: string
}
interface ImportMeta { readonly env: ImportMetaEnv }
