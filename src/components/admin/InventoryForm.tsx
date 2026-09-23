import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { LoadingSpinner } from '../common/States'
import { getApiErrorMessage } from '../../api/errors'
import type { InventoryItem, Product, CreateInventoryRequest } from '../../types/type'

export function InventoryForm({ item, products, loading, onSave }: {
  item?: InventoryItem
  products: Product[]
  loading: boolean
  onSave: (values: CreateInventoryRequest) => Promise<void>
}) {
  const [productId, setProductId] = useState(item ? String(item.product_id) : '')
  const [stock, setStock] = useState(item ? String(item.stock) : '')
  const [reorderPoint, setReorderPoint] = useState(String(item?.reorder_point ?? 0))
  const [error, setError] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    setError('')
    if (!productId.trim() || !stock.trim() || !reorderPoint.trim()) {
      setError('Completa todos los campos.')
      return
    }
    if (item && Number(stock) < item.reserved_stock) {
      setError(`El stock total no puede ser inferior a las ${item.reserved_stock} unidades reservadas.`)
      return
    }
    try {
      await onSave({ product_id: Number(productId), stock: Number(stock), reorder_point: Number(reorderPoint) })
    } catch (failure) {
      setError(getApiErrorMessage(failure))
    }
  }
  return (
    <form className="management-card management-form" onSubmit={submit}>
      <fieldset className="form-grid" disabled={loading}>
        <legend className="sr-only">Datos de inventario</legend>
        <label>
          Producto (ID)
          <input type="number" min="1" max={Number.MAX_SAFE_INTEGER} step="1"
            required readOnly={Boolean(item)} value={productId}
            list={item ? undefined : 'inventory-products'}
            onChange={event => setProductId(event.target.value)} />
          {!item && <datalist id="inventory-products">
            {products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}
          </datalist>}
          <small className="muted">{products.find(product => product.id === Number(productId))?.name ??
            'Usa el identificador del producto en el catálogo.'}</small>
        </label>
        <label>
          Stock total
          <input type="number" required min={item?.reserved_stock ?? 0} max="2147483647" step="1"
            value={stock} onChange={event => setStock(event.target.value)} />
          <small className="muted">Cantidad total resultante, incluidas las unidades reservadas.</small>
        </label>
        <label>
          Punto de reposición
          <input type="number" required min="0" max="2147483647" step="1"
            value={reorderPoint} onChange={event => setReorderPoint(event.target.value)} />
        </label>
        {item && <p className="notice form-wide">
          Reservado: {item.reserved_stock}. Disponible actualmente: {item.available_stock}.
          Las reservas se gestionan mediante los pedidos.
        </p>}
      </fieldset>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="management-actions">
        <button className="button" disabled={loading}>
          {loading && <LoadingSpinner />}
          {loading ? 'Guardando…' : item ? 'Guardar ajuste' : 'Registrar inventario'}
        </button>
        {!loading && <Link className="button button-secondary" to="/admin/inventario">Volver al inventario</Link>}
      </div>
    </form>
  )
}
