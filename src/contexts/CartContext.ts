import { createContext } from 'react'
import type { CartItem, OrderItemRequest, Product } from '../types/type'

export interface CartContextValue {
  items: CartItem[]
  totalItems: number
  subtotal: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  toOrderItems: () => OrderItemRequest[]
}
export const CartContext = createContext<CartContextValue | undefined>(undefined)
