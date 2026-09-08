import { useCallback } from 'react'
import { getMyOrders } from '../services/ordersService'
import { useAuth } from './useAuth'
import { useQuery } from './useQuery'
export function useOrders() {
  const { user } = useAuth()
  const userId = user?.user_id
  const load = useCallback((signal: AbortSignal) => getMyOrders(userId!, signal), [userId])
  const { data, ...state } = useQuery(`orders:${userId}`, load, Boolean(userId))
  return { orders: data ?? [], ...state }
}
