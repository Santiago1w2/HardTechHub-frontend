import { useState, type FormEvent } from 'react'
import type { Order, OrderStatus } from '../../types/type'
import { useUpdateOrderStatus } from '../../hooks/useUpdateOrderStatus'
import { useMutation } from '../../hooks/useMutation'
import { retryOrder } from '../../services/ordersService'
import { orderStatusLabels, orderTransitions } from '../../utils/orders'
import { LoadingSpinner } from '../common/States'
import { getApiErrorMessage } from '../../api/errors'

export function OrderStatusEditor({ order, onUpdated }: { order: Order; onUpdated: () => void }) {
  const [status, setStatus] = useState(order.status)
  const [error, setError] = useState('')
  const update = useUpdateOrderStatus()
  const retry = useMutation(retryOrder)
  const loading = update.loading || retry.loading
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading || status === order.status) return
    setError('')
    try { await update.updateStatus(order.id, status); onUpdated() }
    catch (failure) { setError(getApiErrorMessage(failure)) }
  }
  async function resume() {
    setError('')
    try { await retry.execute(order.id); onUpdated() }
    catch (failure) { setError(getApiErrorMessage(failure)) }
  }
  const allowed = orderTransitions[order.status]
  if (!allowed?.length) return null
  return <form className="management-card management-form" onSubmit={submit}>
    <h2>Estado del pedido</h2>
    <label htmlFor="order-status">Nuevo estado</label>
    <select id="order-status" value={status} disabled={loading}
      onChange={event => setStatus(event.target.value as OrderStatus)}>
      {[order.status, ...allowed].map(value =>
        <option value={value} key={value}>{orderStatusLabels[value]}</option>)}
    </select>
    <p className="muted">Marcar como pagado confirma la salida del inventario. Cancelar libera
    la reserva. Esta acción no procesa pagos ni reembolsos.</p>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="management-actions">
      <button className="button" disabled={loading || status === order.status}>
        {loading && <LoadingSpinner />}Actualizar estado</button>
      {order.status === 'RESERVING' && <button type="button" className="button button-secondary"
        disabled={loading} onClick={() => void resume()}>Reintentar reserva</button>}
    </div>
  </form>
}
