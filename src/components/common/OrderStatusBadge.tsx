import type { OrderStatus } from '../../types/type'
import { orderStatusLabels } from '../../utils/orders'
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{orderStatusLabels[status] || status}</span>
}
