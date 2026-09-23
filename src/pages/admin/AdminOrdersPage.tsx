import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAdminOrderPage } from '../../hooks/useAdminOrderPage'
import { ErrorState, PageSkeleton } from '../../components/common/States'
import { OrderStatusBadge } from '../../components/common/OrderStatusBadge'
import { Pagination } from '../../components/common/Pagination'
import { formatPrice } from '../../utils/formatPrice'
import { formatDate } from '../../utils/catalog'
import {
  readPagination,
  paginationParams,
  filterParams,
} from '../../utils/pagination'
import type { OrderStatus } from '../../types/type'

const statuses: { value: OrderStatus; label: string }[] = [
  { value: 'RESERVING', label: 'Reservando' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'PAID', label: 'Pagado' },
  { value: 'SHIPPED', label: 'Enviado' },
  { value: 'CANCELLED', label: 'Cancelado' },
]

export function AdminOrdersPage() {
  const [params, setParams] = useSearchParams()
  const { page, limit } = readPagination(params)
  const status = statuses.find(
    (item) => item.value === params.get('status'),
  )?.value
  const orderId = params.get('order_id') || ''
  const dateFrom = params.get('date_from') || ''
  const dateTo = params.get('date_to') || ''
  const { orders, total, loading, error, refetch } = useAdminOrderPage({
    page,
    limit,
    status,
    order_id: orderId ? Number(orderId) : undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
  })

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const values = Object.fromEntries(
      ['status', 'order_id', 'date_from', 'date_to'].map((key) => [
        key,
        String(form.get(key) ?? ''),
      ]),
    )
    const endInput = event.currentTarget.elements.namedItem('date_to')
    if (endInput instanceof HTMLInputElement) {
      endInput.setCustomValidity(
        values.date_from && values.date_to && values.date_from > values.date_to
          ? 'La fecha final debe ser igual o posterior a la inicial.'
          : '',
      )
      if (!endInput.reportValidity()) return
    }
    setParams(filterParams(values, limit))
  }

  return (
    <section>
      <div className="section-heading">
        <div>
          <h2>Pedidos de la tienda</h2>
          <p>
            Consulta el historial completo por páginas y filtra los resultados.
          </p>
        </div>
        <button
          className="button button-secondary"
          onClick={refetch}
          disabled={loading}
        >
          Actualizar
        </button>
      </div>
      <form
        key={params.toString()}
        className="management-filters"
        onSubmit={search}
        onChange={(event) => {
          const endInput = event.currentTarget.elements.namedItem('date_to')
          if (endInput instanceof HTMLInputElement)
            endInput.setCustomValidity('')
        }}
      >
        <label>
          Pedido (ID)
          <input
            name="order_id"
            type="number"
            min="1"
            step="1"
            defaultValue={orderId}
          />
        </label>
        <label>
          Estado
          <select name="status" defaultValue={status ?? ''}>
            <option value="">Todos</option>
            {statuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Desde
          <input name="date_from" type="date" defaultValue={dateFrom} />
        </label>
        <label>
          Hasta
          <input name="date_to" type="date" defaultValue={dateTo} />
        </label>
        <div className="management-actions">
          <button className="button" disabled={loading}>
            Buscar
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => setParams({})}
          >
            Limpiar filtros
          </button>
        </div>
      </form>
      {loading ? (
        <PageSkeleton />
      ) : error ? (
        <ErrorState message={error} retry={refetch} />
      ) : !orders.length ? (
        <div className="state-panel">
          <h2>No hay pedidos para mostrar</h2>
          <p>Prueba otros filtros o consulta otra página.</p>
        </div>
      ) : (
        <div
          className="table-scroll"
          role="region"
          aria-label="Pedidos de la tienda"
          tabIndex={0}
        >
          <table className="management-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>{formatPrice(order.total_amount)}</td>
                  <td>
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td>
                    <Link
                      className="text-link"
                      to={`/admin/pedidos/${order.id}`}
                    >
                      Ver y gestionar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!error && (
        <Pagination
          page={page}
          limit={limit}
          total={total}
          loading={loading}
          onChange={(nextPage, nextLimit) =>
            setParams(paginationParams(params, nextPage, nextLimit))
          }
        />
      )}
    </section>
  )
}
