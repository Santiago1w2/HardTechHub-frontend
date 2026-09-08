import { useCallback, useState, type ReactNode } from 'react'
import type { CartItem, Product } from '../types/type'
import { CartContext } from './CartContext'

function validateQuantity(quantity: number) {
  if (!Number.isSafeInteger(quantity) || quantity <= 0) {
    throw new Error('La cantidad debe ser un entero positivo')
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const addItem = useCallback((product: Product, quantity = 1) => {
    validateQuantity(quantity)
    if (
      !Number.isSafeInteger(product.id) ||
      product.id <= 0 ||
      !Number.isFinite(Number(product.price)) ||
      Number(product.price) < 0
    ) {
      throw new Error('Producto inválido')
    }
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      if (!existing) return [...current, { product, quantity }]
      return current.map((item) =>
        item.product.id === product.id
          ? { product, quantity: item.quantity + quantity }
          : item,
      )
    })
  }, [])
  const removeItem = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.product.id !== id))
  }, [])
  const updateQuantity = useCallback((id: number, quantity: number) => {
    validateQuantity(quantity)
    setItems((current) =>
      current.map((item) =>
        item.product.id === id ? { ...item, quantity } : item,
      ),
    )
  }, [])
  const clearCart = useCallback(() => setItems([]), [])
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal =
    items.reduce(
      (sum, item) =>
        sum + Math.round(Number(item.product.price) * 100) * item.quantity,
      0,
    ) / 100
  const toOrderItems = useCallback(
    () =>
      items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    [items],
  )

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toOrderItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
