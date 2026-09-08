import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useCart, useCreateOrder } from '../hooks'
import { CartSummary } from '../components/cart/CartSummary'
import { ProductImage } from '../components/product/ProductImage'
import { EmptyState, LoadingSpinner } from '../components/common/States'
import { Breadcrumb } from '../components/common/Breadcrumb'
import { formatPrice } from '../utils/formatPrice'
import { getApiErrorMessage } from '../api/errors'
export function CheckoutPage() {
  const { items, toOrderItems, clearCart } = useCart()
  const { submitOrder, loading, error } = useCreateOrder()
  const [localError, setLocalError] = useState('')
  const navigate = useNavigate()
  async function confirm() {
    if (loading || !items.length) return
    setLocalError('')
    try {
      const result = await submitOrder(toOrderItems())
      clearCart()
      navigate(`/pedidos/${result.order_id}`, {
        replace: true,
        state: { registered: true },
      })
    } catch (failure) {
      setLocalError(getApiErrorMessage(failure))
    }
  }
  return (
    <div className="container page">
      <Breadcrumb
        current="Confirmar pedido"
        parent={{ label: 'Carrito', href: '/carrito' }}
      />
      <div className="page-heading">
        <span className="eyebrow">REVISA TU SELECCIÓN</span>
        <h1>
          Confirmar pedido<span className="accent">.</span>
        </h1>
        <p>Un último vistazo antes de registrar tu próximo upgrade.</p>
      </div>
      {!items.length ? (
        <EmptyState
          title="Primero, elige tus componentes"
          message="Tu carrito todavía está vacío."
        />
      ) : (
        <div className="purchase-layout">
          <div>
            <div className="checkout-intro">
              <CheckCircle2 size={22} />
              <p>
                Vas a registrar un pedido. Esta acción no realiza ningún cobro.
              </p>
            </div>
            <div className="checkout-items">
              {items.map((item) => (
                <article key={item.product.id}>
                  <ProductImage
                    src={item.product.image_url}
                    name={item.product.name}
                    category={item.product.category}
                  />
                  <div>
                    <h3>{item.product.name}</h3>
                    <p>
                      {item.quantity}{' '}
                      {item.quantity === 1 ? 'unidad' : 'unidades'} ·{' '}
                      {formatPrice(item.product.price)} c/u
                    </p>
                  </div>
                  <strong>
                    {formatPrice(
                      (Math.round(Number(item.product.price) * 100) *
                        item.quantity) /
                        100,
                    )}
                  </strong>
                </article>
              ))}
            </div>
            <Link to="/carrito" className="text-link continue-shopping">
              Modificar mi selección
            </Link>
          </div>
          <CartSummary checkout>
            {(localError || error) && (
              <p className="form-error" role="alert">
                {localError || error}
              </p>
            )}
            <button
              className="button full-width"
              onClick={confirm}
              disabled={loading}
            >
              {loading ? <LoadingSpinner /> : <ArrowRight size={18} />}
              {loading ? 'Registrando pedido…' : 'Confirmar pedido'}
            </button>
          </CartSummary>
        </div>
      )}
    </div>
  )
}
