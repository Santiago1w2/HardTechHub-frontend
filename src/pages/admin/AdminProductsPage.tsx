import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useAdminProducts } from '../../hooks/useAdminProducts'
import { useDeleteProduct } from '../../hooks/useDeleteProduct'
import { ProductImage } from '../../components/product/ProductImage'
import { ErrorState, PageSkeleton } from '../../components/common/States'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { Pagination } from '../../components/common/Pagination'
import { formatPrice } from '../../utils/formatPrice'
import {
  readPagination,
  paginationParams,
  filterParams,
} from '../../utils/pagination'
import { getApiErrorMessage } from '../../api/errors'
import type { ProductDetail, ProductStatusFilter } from '../../types/type'

export function AdminProductsPage() {
  const [params, setParams] = useSearchParams()
  const { page, limit } = readPagination(params)
  const requestedStatus = params.get('status')
  const status: ProductStatusFilter =
    requestedStatus === 'active' || requestedStatus === 'inactive'
      ? requestedStatus
      : 'all'
  const q = params.get('q') || ''
  const { products, total, loading, error, refetch } = useAdminProducts({
    page,
    limit,
    status,
    q,
  })
  const { deleteProduct, loading: deleting } = useDeleteProduct()
  const [selected, setSelected] = useState<ProductDetail | null>(null)
  const [failure, setFailure] = useState('')
  const [message, setMessage] = useState('')

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setParams(
      filterParams(
        {
          q: String(form.get('q') ?? ''),
          status: String(form.get('status') ?? 'all'),
        },
        limit,
      ),
    )
  }

  async function deactivate() {
    if (!selected || deleting) return
    setFailure('')
    try {
      await deleteProduct(selected.id)
      setMessage(
        `${selected.name} fue desactivado. Puedes encontrarlo en el filtro de inactivos.`,
      )
      setSelected(null)
      if (status === 'active' && products.length === 1 && page > 1) {
        setParams(paginationParams(params, page - 1, limit))
      } else refetch()
    } catch (error) {
      setFailure(getApiErrorMessage(error))
    }
  }

  return (
    <section>
      <div className="section-heading">
        <div>
          <h2>Productos</h2>
          <p>Consulta y gestiona productos activos e inactivos.</p>
        </div>
        <Link className="button" to="/admin/productos/nuevo">
          <Plus size={17} />
          Crear producto
        </Link>
      </div>
      <form
        key={params.toString()}
        className="management-filters"
        onSubmit={search}
      >
        <label>
          Nombre, SKU, categoría o marca
          <input type="search" name="q" defaultValue={q} maxLength={180} />
        </label>
        <label>
          Estado
          <select name="status" defaultValue={status}>
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
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
      {message && (
        <p className="success-banner" role="status">
          {message}
        </p>
      )}
      {loading ? (
        <PageSkeleton />
      ) : error ? (
        <ErrorState message={error} retry={refetch} />
      ) : !products.length ? (
        <div className="state-panel">
          <h2>No hay productos para mostrar</h2>
          <p>Prueba otros filtros o consulta otra página.</p>
          <Link className="button" to="/admin/productos/nuevo">
            Crear producto
          </Link>
        </div>
      ) : (
        <div
          className="table-scroll"
          role="region"
          aria-label="Productos de la tienda"
          tabIndex={0}
        >
          <table className="management-table">
            <thead>
              <tr>
                <th>Producto / SKU</th>
                <th>Categoría / Marca</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="management-product">
                      <ProductImage
                        src={product.image_url}
                        name={product.name}
                        category={product.category}
                      />
                      <div>
                        <strong>{product.name}</strong>
                        <small>
                          {product.sku} · ID {product.id}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    {product.category}
                    <small>{product.brand}</small>
                  </td>
                  <td>{formatPrice(product.price)}</td>
                  <td>
                    <span
                      className={`status-badge ${product.is_active ? 'status-paid' : 'status-cancelled'}`}
                    >
                      {product.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="management-actions">
                      <Link
                        className="text-link"
                        to={`/admin/productos/${product.id}/editar`}
                      >
                        {product.is_active ? 'Editar' : 'Editar / Reactivar'}
                      </Link>
                      {product.is_active && (
                        <button
                          className="text-button"
                          onClick={() => {
                            setSelected(product)
                            setFailure('')
                          }}
                        >
                          Desactivar
                        </button>
                      )}
                    </div>
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
      {selected && (
        <ConfirmDialog
          title="¿Desactivar producto?"
          confirmLabel="Desactivar"
          loading={deleting}
          error={failure}
          onConfirm={() => {
            void deactivate()
          }}
          onClose={() => setSelected(null)}
        >
          <p>
            {selected.name} dejará de aparecer en el catálogo. Su información se
            conserva y podrás reactivarlo desde la edición.
          </p>
        </ConfirmDialog>
      )}
    </section>
  )
}
