import type { ReactNode } from 'react'
import { useCart } from '../../hooks'
import { formatPrice } from '../../utils/formatPrice'
export function CartSummary({
  children,
  checkout = false,
}: {
  children: ReactNode
  checkout?: boolean
}) {
  const { subtotal, totalItems } = useCart()
  return (
    <aside className="cart-summary">
      <span className="eyebrow">UN PASO MÁS CERCA</span>
      <h2>Resumen del pedido</h2>
      <div className="summary-row">
        <span>Productos</span>
        <strong>{totalItems}</strong>
      </div>
      <div className="summary-row summary-total">
        <span>Subtotal {checkout ? 'estimado' : ''}</span>
        <strong>{formatPrice(subtotal)}</strong>
      </div>
      <p>
        {checkout
          ? 'El total definitivo será calculado por el servidor al confirmar.'
          : 'Impuestos y envío se calcularán al confirmar el pedido.'}
      </p>
      {children}
      <span className="summary-footnote">
        Revisa los productos y sus cantidades antes de continuar.
      </span>
    </aside>
  )
}
