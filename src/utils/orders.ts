import type { OrderStatus } from '../types/type'
export const orderStatusLabels: Record<OrderStatus, string> = {
  RESERVING: 'Reserva pendiente', PENDING: 'Pendiente', PAID: 'Pagado',
  SHIPPED: 'Enviado', CANCELLED: 'Cancelado',
}
export const orderTransitions: Record<OrderStatus, OrderStatus[]> = {
  RESERVING: ['CANCELLED'], PENDING: ['PAID', 'CANCELLED'],
  PAID: ['SHIPPED'], SHIPPED: [], CANCELLED: [],
}
