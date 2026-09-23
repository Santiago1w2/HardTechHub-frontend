import { createContext } from 'react'
import type { Product } from '../types/type'

export interface CatalogContextValue {
  products: Product[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export const CatalogContext = createContext<CatalogContextValue | undefined>(
  undefined,
)
