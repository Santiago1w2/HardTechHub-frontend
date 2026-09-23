import { useCallback } from 'react'
import { getInventory } from '../services/inventoryService'
import { useQuery } from './useQuery'
export function useInventory(productId: number) {
  const load = useCallback((signal: AbortSignal) => getInventory(productId, signal), [productId])
  return useQuery(`inventory:${productId}`, load, Number.isSafeInteger(productId) && productId > 0)
}
