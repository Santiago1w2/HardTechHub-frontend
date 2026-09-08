import type { OrderStatus } from '../../types/type'
const labels: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  SHIPPED: 'Enviado',
  CANCELLED: 'Cancelado',
}
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      {labels[status] || status}
    </span>
  )
}
