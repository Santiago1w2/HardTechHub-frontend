import { Link } from 'react-router-dom'
import {
  Package,
  Boxes,
  ShoppingBag,
  ChartNoAxesColumn,
  ArrowRight,
} from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import { useAdminOrders } from '../../hooks/useAdminOrders'
import { ErrorState, PageSkeleton } from '../../components/common/States'

export function AdminDashboardPage() {
  const catalog = useProducts()
  const orders = useAdminOrders()
  return (
    <section>
      <div className="section-heading">
        <div>
          <span className="eyebrow">GESTIÓN DE LA TIENDA</span>
          <h2>Resumen de la tienda</h2>
        </div>
      </div>
      {catalog.loading || orders.loading ? (
        <PageSkeleton />
      ) : catalog.error || orders.error ? (
        <ErrorState
          message={catalog.error || orders.error || ''}
          retry={() => {
            catalog.refetch()
            orders.refetch()
          }}
        />
      ) : (
        <div
          className="admin-summary management-card"
          aria-label="Resumen de actividad"
        >
          <div>
            <strong>{catalog.products.length}</strong>
            <span>productos activos</span>
          </div>
          <div>
            <strong>{orders.orders.length}</strong>
            <span>pedidos recientes consultados (máximo 50)</span>
          </div>
          <div>
            <strong>
              {
                orders.orders.filter((order) => order.status === 'PENDING')
                  .length
              }
            </strong>
            <span>pendientes dentro de esos pedidos</span>
          </div>
        </div>
      )}
      <div className="admin-dashboard">
        {[
          {
            to: '/admin/productos',
            icon: Package,
            title: 'Productos',
            description: 'Crea, edita y desactiva componentes del catálogo.',
          },
          {
            to: '/admin/inventario',
            icon: Boxes,
            title: 'Inventario',
            description: 'Registra stock, ajusta cantidades y consulta reservas.',
          },
          {
            to: '/admin/pedidos',
            icon: ShoppingBag,
            title: 'Pedidos',
            description:
              'Consulta los pedidos más recientes y actualiza su estado.',
          },
          {
            to: '/admin/analitica',
            icon: ChartNoAxesColumn,
            title: 'Analítica',
            description: 'Consulta ventas, tendencias y movimientos de inventario.',
          },
        ].map(({ to, icon: Icon, title, description }) => (
          <Link to={to} className="management-card admin-shortcut" key={to}>
            <Icon size={30} className="accent" />
            <h3>{title}</h3>
            <p className="muted">{description}</p>
            <span className="text-link">
              Abrir sección <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
