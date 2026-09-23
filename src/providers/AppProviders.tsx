import type { ReactNode } from 'react'
import { CatalogProvider } from '../contexts/CatalogProvider'
import { CartProvider } from '../contexts/CartProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return <CatalogProvider><CartProvider>{children}</CartProvider></CatalogProvider>
}
