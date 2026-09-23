import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useInventoryPage, inventoryPageSize } from '../../hooks/useInventoryPage'
import { useProducts } from '../../hooks/useProducts'
import { ErrorState, PageSkeleton } from '../../components/common/States'
import { formatDate } from '../../utils/catalog'

export function AdminInventoryPage() {
  const [params, setParams] = useSearchParams()
  const parsedPage = Number(params.get('page') || '1')
  const page = Number.isSafeInteger(parsedPage) && parsedPage > 0 &&
    parsedPage <= Math.floor(Number.MAX_SAFE_INTEGER / inventoryPageSize) ? parsedPage : 1
  const inventory = useInventoryPage(page)
  const catalog = useProducts()
  const location = useLocation()
  const saved = (location.state as { inventorySaved?: number } | null)?.inventorySaved
  const products = new Map(catalog.products.map(product => [product.id, product]))
  function changePage(next: number) {
    const nextParams = new URLSearchParams(params)
    nextParams.set('page', String(next))
    setParams(nextParams)
  }
  return (
    <section>
      <div className="section-heading">
        <div><h2>Inventario</h2><p>Stock total, reservas y disponibilidad de los productos.</p></div>
        <div className="management-actions">
          <button className="button button-secondary" disabled={inventory.loading} onClick={inventory.refetch}>Actualizar</button>
          <Link className="button" to="/admin/inventario/nuevo">Registrar inventario</Link>
        </div>
      </div>
      {saved !== undefined && <p className="success-banner" role="status">Inventario del producto #{saved} guardado correctamente.</p>}
      {catalog.error && <p className="notice">No se pudieron cargar los nombres. El inventario se muestra por ID.{' '}
        <button className="text-button" onClick={catalog.refetch}>Reintentar catálogo</button></p>}
      {inventory.loading ? <PageSkeleton /> : inventory.error ?
        <ErrorState message={inventory.error} retry={inventory.refetch} /> :
        !inventory.items.length ? <div className="state-panel"><h2>No hay inventario en esta página</h2>
          <p>Registra stock para un producto o vuelve a la página anterior.</p></div> :
        <div className="table-scroll" role="region" aria-label="Inventario de productos" tabIndex={0}>
          <table className="management-table">
            <thead><tr>{['Producto', 'Stock total', 'Reservado', 'Disponible', 'Reposición', 'Actualización', 'Acciones']
              .map(label => <th key={label}>{label}</th>)}</tr></thead>
            <tbody>{inventory.items.map(item => <tr key={item.product_id}>
              <td><Link className="text-link" to={`/productos/${item.product_id}`}>
                {products.get(item.product_id)?.name ?? `Producto #${item.product_id}`}
              </Link><small>ID: {item.product_id}</small></td>
              <td>{item.stock}</td><td>{item.reserved_stock}</td><td>{item.available_stock}</td>
              <td>{item.reorder_point}</td><td>{item.updated_at ? formatDate(item.updated_at) : '—'}</td>
              <td><Link className="text-link" to={`/admin/inventario/${item.product_id}/editar`}>Ajustar stock</Link></td>
            </tr>)}</tbody>
          </table>
        </div>}
      <nav className="management-pagination" aria-label="Paginación del inventario">
        <p role="status">Página {page}{!inventory.loading && !inventory.error ? ` · ${inventory.items.length} registros mostrados` : ''}</p>
        <div className="management-actions">
          <button className="button button-secondary" disabled={inventory.loading || page <= 1}
            onClick={() => changePage(page - 1)}>Anterior</button>
          <button className="button button-secondary" disabled={inventory.loading || Boolean(inventory.error) || !inventory.hasNext}
            onClick={() => changePage(page + 1)}>Siguiente</button>
        </div>
      </nav>
    </section>
  )
}
