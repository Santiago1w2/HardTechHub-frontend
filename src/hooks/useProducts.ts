import { useContext } from 'react'
import { CatalogContext } from '../contexts/CatalogContext'

export function useProducts() {
  const context = useContext(CatalogContext)
  if (!context) throw new Error('useProducts requiere CatalogProvider')
  return context
}
