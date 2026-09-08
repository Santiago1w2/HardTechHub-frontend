import { Link } from 'react-router-dom'
import { Breadcrumb } from '../components/common/Breadcrumb'
export function HelpPage() {
  return (
    <div className="container page help-page">
      <Breadcrumb current="Antes de comprar" />
      <div className="page-heading">
        <span className="eyebrow">COMPRA CON INFORMACIÓN</span>
        <h1>Estamos en la misma página.</h1>
        <p>Lo que necesitas saber para hacer tu pedido.</p>
      </div>
      <section id="pedidos">
        <h2>Cómo hacer un pedido</h2>
        <p>
          Inicia sesión, explora el catálogo y añade los componentes a tu
          carrito. Revisa las cantidades y continúa a Confirmar pedido. Al
          confirmar se registra un pedido pendiente; no se realiza un pago.
        </p>
        <Link className="text-link" to="/productos">
          Explorar el catálogo →
        </Link>
      </section>
      <section id="envios">
        <h2>Importes y envío</h2>
        <p>
          El subtotal del carrito es estimado. El servidor calcula el precio
          vigente, IGV y el importe de envío al registrar tu pedido. Puedes
          consultar todos los importes en su detalle. No se muestran plazos de
          entrega ni seguimiento de transporte.
        </p>
      </section>
      <section id="sesion">
        <h2>Tu sesión y carrito</h2>
        <p>
          Inicia sesión antes de añadir productos. El carrito está asociado a la
          sesión actual y se reinicia al cambiar de usuario o recargar la
          aplicación. El registro de una cuenta no inicia sesión
          automáticamente.
        </p>
      </section>
      <section>
        <h2>Información y especificaciones</h2>
        <p>
          Revisa las especificaciones de cada componente antes de confirmar. La
          tienda no realiza comprobaciones automáticas de compatibilidad. No se
          han publicado políticas de devolución ni canales de soporte
          adicionales.
        </p>
      </section>
    </div>
  )
}
