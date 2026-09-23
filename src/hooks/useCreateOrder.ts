import { useCallback, useRef } from 'react'
import { createOrder } from '../services/ordersService'
import type { OrderItemRequest } from '../types/type'
import { useMutation } from './useMutation'
export function useCreateOrder() {
  const attempt = useRef<{ signature: string; key: string } | null>(null)
  const submit = useCallback((items: OrderItemRequest[]) => {
    const signature = JSON.stringify(items)
    if (attempt.current?.signature !== signature) {
      attempt.current = { signature, key: Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('') }
    }
    return createOrder({ items }, attempt.current.key)
  }, [])
  const { execute, ...state } = useMutation(submit)
  return { submitOrder: execute, ...state }
}
