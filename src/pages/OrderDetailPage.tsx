import { useLocation, useParams } from 'react-router-dom'
import { CheckCircle2, Package } from 'lucide-react'
import { useAuth, useOrder } from '../hooks'
import { formatPrice } from '../utils/formatPrice'
import { formatDate } from '../utils/catalog'
import {
  ErrorState,
  EmptyState,
  PageSkeleton,
} from '../components/common/States'
import { OrderStatusBadge } from '../components/common/OrderStatusBadge'
import { Breadcrumb } from '../components/common/Breadcrumb'
export function OrderDetailPage() {
  const { id } = useParams()
  const { order: detail, loading, error, refetch } = useOrder(Number(id))
  const { user } = useAuth()
  const location = useLocation()
  const registered = (location.state as { registered?: boolean } | null)
    ?.registered
  return (
    <div className="container page">
      <Breadcrumb
        current={`Pedido #${id}`}
        parent={{ label: 'Mis pedidos', href: '/pedidos' }}
      />
      {loading ? (
        <PageSkeleton />
      ) : error ? (
        <ErrorState message={error} retry={refetch} />
      ) : !detail || detail.order.user_id !== user?.user_id ? (
        <EmptyState
          title="Pedido no disponible"
          message="Consulta los pedidos de tu cuenta."
          href="/pedidos"
          action="Mis pedidos"
        />
      ) : (
        <>
          {registered && (
            <div className="success-banner" role="status">
              <CheckCircle2 />
              <div>
                <strong>Pedido registrado</strong>
                <p>
                  Tu pedido está pendiente. No se ha realizado ningún cobro.
                </p>
              </div>
            </div>
          )}
          <div className="page-heading order-title">
            <div>
              <span className="eyebrow">DETALLE DE TU COMPRA</span>
              <h1>Pedido #{String(detail.order.id).padStart(5, '0')}</h1>
              <p>Registrado el {formatDate(detail.order.created_at)}</p>
            </div>
            <OrderStatusBadge status={detail.order.status} />
          </div>
          <div className="purchase-layout">
            <section className="historical-items">
              <h2>Productos del pedido</h2>
              {detail.items.map((item) => (
                <article key={item.id}>
                  <span className="historical-icon">
                    <Package size={26} />
                  </span>
                  <div>
                    <h3>{item.product_name}</h3>
                    <p>{item.product_sku}</p>
                    <small>
                      {item.quantity} × {formatPrice(item.unit_price)}
                    </small>
                  </div>
                  <strong>{formatPrice(item.subtotal)}</strong>
                </article>
              ))}
            </section>
            <aside className="cart-summary">
              <h2>Importes registrados</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>{formatPrice(detail.order.subtotal)}</strong>
              </div>
              <div className="summary-row">
                <span>IGV</span>
                <strong>{formatPrice(detail.order.tax)}</strong>
              </div>
              <div className="summary-row">
                <span>Envío</span>
                <strong>{formatPrice(detail.order.shipping_cost)}</strong>
              </div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <strong>{formatPrice(detail.order.total_amount)}</strong>
              </div>
              <p>Precios registrados al crear este pedido.</p>
              <small>
                Última actualización: {formatDate(detail.order.updated_at)}
              </small>
            </aside>
          </div>
        </>
      )}
    </div>
  )
}
