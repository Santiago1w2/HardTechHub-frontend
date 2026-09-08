import { useCallback } from 'react'
import { getOrder } from '../services/ordersService'
import { useQuery } from './useQuery'
export function useOrder(id?: number) {
  const enabled = typeof id === 'number' && Number.isSafeInteger(id) && id > 0
  const load = useCallback((signal: AbortSignal) => getOrder(id!, signal), [id])
  const { data, ...state } = useQuery(`order:${id}`, load, enabled)
  return { order: data ?? null, ...state }
}
