import { useCallback } from 'react'
import { getInventoryList } from '../services/inventoryService'
import { useQuery } from './useQuery'

export const inventoryPageSize = 20

export function useInventoryPage(page: number) {
  const offset = (page - 1) * inventoryPageSize
  const load = useCallback(
    (signal: AbortSignal) => getInventoryList(inventoryPageSize + 1, offset, signal),
    [offset],
  )
  const query = useQuery(`inventory-page:${page}`, load)
  return {
    ...query,
    items: query.data?.slice(0, inventoryPageSize) ?? [],
    hasNext: (query.data?.length ?? 0) > inventoryPageSize,
  }
}
