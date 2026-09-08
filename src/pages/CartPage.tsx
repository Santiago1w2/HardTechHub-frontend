import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useAuth, useCart } from '../hooks'
import { CartItem } from '../components/cart/CartItem'
import { CartSummary } from '../components/cart/CartSummary'
import { EmptyState } from '../components/common/States'
import { Breadcrumb } from '../components/common/Breadcrumb'
export function CartPage() {
  const { items, totalItems } = useCart()
  const { isAuthenticated } = useAuth()
  return (
    <div className="container page">
      <Breadcrumb current="Carrito" />
      <div className="page-heading">
        <span className="eyebrow">TU PRÓXIMO SETUP EMPIEZA AQUÍ</span>
        <h1>
          Tu carrito<span className="accent">.</span>
        </h1>
        <p>
          {totalItems}{' '}
          {totalItems === 1
            ? 'producto seleccionado'
            : 'productos seleccionados'}
        </p>
      </div>
      {!items.length ? (
        <EmptyState
          title="Tu carrito está vacío"
          message="Explora nuestros componentes y arma tu próxima PC."
        />
      ) : (
        <div className="purchase-layout">
          <div>
            <div className="cart-items">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
            <Link className="text-link continue-shopping" to="/productos">
              <ArrowLeft size={16} />
              Seguir explorando
            </Link>
          </div>
          <CartSummary>
            {isAuthenticated ? (
              <Link className="button full-width" to="/checkout">
                Continuar compra
                <ArrowRight size={17} />
              </Link>
            ) : (
              <>
                <p className="notice">
                  Inicia sesión antes de continuar. Al iniciar sesión se
                  reinicia el carrito actual.
                </p>
                <Link to="/login" className="button full-width">
                  Iniciar sesión
                  <ArrowRight size={17} />
                </Link>
              </>
            )}
          </CartSummary>
        </div>
      )}
    </div>
  )
}
