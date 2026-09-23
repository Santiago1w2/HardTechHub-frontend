import { NavLink, Outlet } from 'react-router-dom'
import { Breadcrumb } from '../common/Breadcrumb'

export function AdminLayout() {
  return (
    <div className="container page">
      <Breadcrumb current="Administración" />
      <div className="page-heading">
        <span className="eyebrow">HARDTECH HUB / ADMINISTRACIÓN</span>
        <h1>
          Tu tienda, al día<span className="accent">.</span>
        </h1>
        <p>Gestiona el catálogo, sigue los pedidos y consulta la actividad.</p>
      </div>
      <nav className="admin-nav" aria-label="Administración">
        <NavLink to="/admin" end>
          Resumen
        </NavLink>
        <NavLink to="/admin/productos">Productos</NavLink>
        <NavLink to="/admin/inventario">Inventario</NavLink>
        <NavLink to="/admin/pedidos">Pedidos</NavLink>
        <NavLink to="/admin/analitica">Analítica</NavLink>
      </nav>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}
