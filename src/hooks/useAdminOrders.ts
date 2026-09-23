import { getAllOrders } from '../services/ordersService'
import { useQuery } from './useQuery'
export function useAdminOrders() {
  const { data, ...state } = useQuery('recent-orders', getAllOrders)
  return { orders: data ?? [], ...state }
}
