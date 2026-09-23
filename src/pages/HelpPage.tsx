import { Link } from 'react-router-dom'
import { Breadcrumb } from '../components/common/Breadcrumb'
export function HelpPage() {
  return <div className="container page help-page">
    <Breadcrumb current="Antes de comprar" />
    <div className="page-heading"><span className="eyebrow">COMPRA CON INFORMACIÓN</span>
    <h1>Antes de hacer tu pedido.</h1></div>
    <section id="pedidos"><h2>Cómo hacer un pedido</h2>
      <p>Explora el catálogo, añade componentes al carrito y revisa las cantidades.
      Al registrar el pedido se valida el precio actual y se intenta reservar el stock.
      Esta acción no realiza ningún cobro.</p>
      <Link className="text-link" to="/productos">Explorar el catálogo →</Link></section>
    <section id="envios"><h2>Importes y envío</h2>
      <p>El subtotal del carrito es estimado. El servidor calcula los precios vigentes,
      IGV y envío al registrar el pedido. Sus importes definitivos aparecen en el detalle.</p></section>
    <section id="carrito"><h2>Tu selección</h2><p>El carrito permanece mientras esta aplicación está abierta.
      Al recargar se vacía. Los pedidos registrados se conservan y se consultan por su número.</p>
      <Link className="text-link" to="/pedidos">Consultar pedidos →</Link></section>
    <section><h2>Compatibilidad</h2><p>Compara los sockets de CPU y placa, el tipo de memoria
      de RAM y placa, y los requisitos de potencia de GPU y fuente. La disponibilidad
      de stock se comprueba por separado al crear el pedido.</p>
      <Link className="text-link" to="/compatibilidad">Comprobar compatibilidad →</Link></section>
  </div>
}
