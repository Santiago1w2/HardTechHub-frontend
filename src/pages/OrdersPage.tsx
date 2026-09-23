import { Breadcrumb } from '../components/common/Breadcrumb'
import { AdminOrdersPage } from './admin/AdminOrdersPage'
export function OrdersPage() {
  return <div className="container page">
    <Breadcrumb current="Pedidos" />
    <div className="page-heading"><span className="eyebrow">HARDTECH HUB</span><h1>Pedidos<span className="accent">.</span></h1>
    <p>Consulta los pedidos de la tienda y el estado de sus reservas.</p></div>
    <AdminOrdersPage />
  </div>
}
