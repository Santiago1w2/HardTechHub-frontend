import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from './useCart'
import { getApiErrorMessage } from '../api/errors'
import type { Product } from '../types/type'
export function useProductPurchase() {
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState('')
  const [failed, setFailed] = useState(false)
  function add(product: Product, quantity = 1, buyNow = false) {
    try {
      addItem(product, quantity)
      setFailed(false)
      setFeedback('Añadido al carrito')
      if (buyNow) navigate('/carrito')
    } catch (error) { setFailed(true); setFeedback(getApiErrorMessage(error)) }
  }
  return { add, feedback, failed }
}
