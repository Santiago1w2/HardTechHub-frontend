import { useCallback } from 'react'
import { createOrder } from '../services/ordersService'
import type { OrderItemRequest } from '../types/type'
import { useAuth } from './useAuth'
import { useMutation } from './useMutation'
export function useCreateOrder() {
  const { user } = useAuth()
  const submit = useCallback((items: OrderItemRequest[]) => {
    if (!user) throw new Error('Inicia sesión para crear un pedido')
    return createOrder({ user_id: user.user_id, items })
  }, [user])
  const { execute, ...state } = useMutation(submit)
  return { submitOrder: execute, ...state }
}
