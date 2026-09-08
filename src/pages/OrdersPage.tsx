import { Link } from 'react-router-dom'
import { ArrowUpRight, Package } from 'lucide-react'
import { useOrders } from '../hooks'
import { formatPrice } from '../utils/formatPrice'
import { formatDate } from '../utils/catalog'
import {
  ErrorState,
  EmptyState,
  PageSkeleton,
} from '../components/common/States'
import { OrderStatusBadge } from '../components/common/OrderStatusBadge'
import { Breadcrumb } from '../components/common/Breadcrumb'
export function OrdersPage() {
  const { orders, loading, error, refetch } = useOrders()
  return (
    <div className="container page account-page">
      <Breadcrumb current="Mis pedidos" />
      <div className="page-heading">
        <span className="eyebrow">TU HISTORIAL EN HARDTECH HUB</span>
        <h1>
          Mis pedidos<span className="accent">.</span>
        </h1>
        <p>Cada componente, un paso más hacia tu próximo setup.</p>
      </div>
      {loading ? (
        <PageSkeleton />
      ) : error ? (
        <ErrorState message={error} retry={refetch} />
      ) : !orders.length ? (
        <EmptyState
          title="Tu primer upgrade está por llegar"
          message="Aún no has registrado pedidos. Explora el catálogo para comenzar."
        />
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Link
              className="order-card"
              to={`/pedidos/${order.id}`}
              key={order.id}
            >
              <span className="order-icon">
                <Package size={24} />
              </span>
              <div>
                <span className="eyebrow">PEDIDO</span>
                <h2>#{String(order.id).padStart(5, '0')}</h2>
                <small>{formatDate(order.created_at)}</small>
              </div>
              <OrderStatusBadge status={order.status} />
              <strong>{formatPrice(order.total_amount)}</strong>
              <span className="order-detail-link">
                Ver detalle
                <ArrowUpRight size={18} />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
