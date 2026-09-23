import { useCallback } from 'react'
import { getAdminProducts } from '../services/catalogService'
import type { AdminProductFilters } from '../types/type'
import { useQuery } from './useQuery'
export function useAdminProducts({ page, limit, status, q }: AdminProductFilters) {
  const load = useCallback((signal: AbortSignal) =>
    getAdminProducts({ page, limit, status, q }, signal), [page, limit, status, q])
  const { data, ...state } = useQuery(JSON.stringify(['products', page, limit, status, q]), load)
  return { products: data?.items ?? [], total: data?.total ?? 0, ...state }
}
