import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Wordmark } from './Header'
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Wordmark />
          <p>
            El siguiente nivel empieza con
            <br />
            los componentes correctos.
          </p>
          <span className="footer-tag">HARDWARE. PASIÓN. POTENCIA.</span>
        </div>
        <div>
          <h3>Comprar</h3>
          <Link to="/productos">Todos los productos</Link>
        </div>
        <div>
          <h3>La tienda</h3>
          <Link to="/analitica">Analítica</Link>
          <Link to="/pedidos">Pedidos</Link>
          <Link to="/carrito">Mi carrito</Link>
          <Link to="/admin">Gestionar catálogo</Link>
        </div>
        <div>
          <h3>Antes de comprar</h3>
          <Link to="/compatibilidad">Comprobar compatibilidad</Link>
          <Link to="/ayuda">
            Centro de ayuda <ArrowUpRight size={14} />
          </Link>
          <Link to="/ayuda#pedidos">Cómo hacer un pedido</Link>
          <Link to="/ayuda#envios">Importes y envío</Link>
          <Link to="/ayuda#carrito">Tu carrito</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 HardTech Hub</span>
        <span>Diseñado para quienes construyen lo que viene.</span>
        <span>Perú · PEN / S/</span>
      </div>
    </footer>
  )
}
