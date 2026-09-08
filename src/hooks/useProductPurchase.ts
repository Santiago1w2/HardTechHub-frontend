import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { useCart } from './useCart'
import { getApiErrorMessage } from '../api/errors'
import type { Product } from '../types/type'
export function useProductPurchase() {
  const { isAuthenticated } = useAuth()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [feedback, setFeedback] = useState('')
  const [failed, setFailed] = useState(false)
  function add(product: Product, quantity = 1, buyNow = false) {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname + location.search, message: 'Inicia sesión para añadir productos. Tu carrito estará vinculado a esta sesión.' } })
      return
    }
    try {
      addItem(product, quantity)
      setFailed(false)
      setFeedback('Añadido al carrito')
      if (buyNow) navigate('/carrito')
    } catch (error) { setFailed(true); setFeedback(getApiErrorMessage(error)) }
  }
  return { add, feedback, failed }
}
