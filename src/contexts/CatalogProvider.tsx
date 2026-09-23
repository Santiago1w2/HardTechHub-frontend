import type { ReactNode } from 'react'
import { CatalogContext } from './CatalogContext'
import { getProducts } from '../services/catalogService'
import { useQuery } from '../hooks/useQuery'

export function CatalogProvider({ children }: { children: ReactNode }) {
  const { data, ...state } = useQuery('products', getProducts)
  return (
    <CatalogContext.Provider value={{ products: data ?? [], ...state }}>
      {children}
    </CatalogContext.Provider>
  )
}
