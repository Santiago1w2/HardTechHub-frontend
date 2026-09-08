import { Link, useNavigate } from 'react-router-dom'
import { UserRound, LogOut, ArrowRight, Package } from 'lucide-react'
import { useAuth } from '../hooks'
import { formatDate } from '../utils/catalog'
import { Breadcrumb } from '../components/common/Breadcrumb'
export function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  if (!user) return null
  return (
    <div className="container page account-page">
      <Breadcrumb current="Mi perfil" />
      <div className="page-heading">
        <span className="eyebrow">TU ESPACIO EN HARDTECH HUB</span>
        <h1>
          Hola, {user.email.split('@')[0]}
          <span className="accent">.</span>
        </h1>
        <p>La información de tu cuenta, en un solo lugar.</p>
      </div>
      <div className="profile-layout">
        <section className="profile-card">
          <div className="profile-avatar">
            <UserRound size={38} />
          </div>
          <h2>Mi perfil</h2>
          <span className="muted">Información de solo lectura</span>
          <dl>
            {[
              ['Correo electrónico', user.email],
              ['ID de usuario', user.user_id],
              ['Roles', user.roles.join(', ') || 'Sin roles'],
              ['Miembro desde', formatDate(user.created_at)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <button
            className="button button-secondary"
            onClick={() => {
              logout()
              navigate('/', { replace: true })
            }}
          >
            <LogOut size={17} />
            Cerrar sesión
          </button>
        </section>
        <div className="profile-shortcuts">
          <Link to="/pedidos">
            <Package size={30} />
            <h2>Tus pedidos</h2>
            <p>
              Consulta los componentes que has elegido y el estado de cada
              pedido.
            </p>
            <span className="text-link">
              Ver mis pedidos
              <ArrowRight size={18} />
            </span>
          </Link>
          <div className="notice">
            Tu sesión y carrito se reinician al recargar la aplicación o cerrar
            sesión.
          </div>
        </div>
      </div>
    </div>
  )
}
