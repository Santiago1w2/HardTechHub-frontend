import { useCallback } from 'react'
import { getProduct } from '../services/catalogService'
import { useQuery } from './useQuery'
export function useProduct(id?: number) {
  const enabled = typeof id === 'number' && Number.isSafeInteger(id) && id > 0
  const load = useCallback((signal: AbortSignal) => getProduct(id!, signal), [id])
  const { data, ...state } = useQuery(`product:${id}`, load, enabled)
  return { product: data ?? null, ...state }
}
