import { updateOrderStatus } from '../services/ordersService'
import { useMutation } from './useMutation'
export function useUpdateOrderStatus() {
  const { execute, ...state } = useMutation(updateOrderStatus)
  return { updateStatus: execute, ...state }
}
