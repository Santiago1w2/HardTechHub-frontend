import { useCallback } from 'react'
import { getAdminOrders } from '../services/ordersService'
import type { AdminOrderFilters } from '../types/type'
import { useQuery } from './useQuery'
export function useAdminOrderPage({ page, limit, status, order_id, date_from, date_to }: AdminOrderFilters) {
  const load = useCallback((signal: AbortSignal) =>
    getAdminOrders({ page, limit, status, order_id, date_from, date_to }, signal),
    [page, limit, status, order_id, date_from, date_to])
  const { data, ...state } = useQuery(
    JSON.stringify(['orders', page, limit, status, order_id, date_from, date_to]), load)
  return { orders: data?.items ?? [], total: data?.total ?? 0, ...state }
}
