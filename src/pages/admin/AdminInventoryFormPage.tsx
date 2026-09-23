import { useNavigate, useParams } from 'react-router-dom'
import { InventoryForm } from '../../components/admin/InventoryForm'
import { ErrorState, EmptyState, PageSkeleton } from '../../components/common/States'
import { useProducts } from '../../hooks/useProducts'
import { useInventory } from '../../hooks/useInventory'
import { useMutation } from '../../hooks/useMutation'
import { createInventory, updateInventory } from '../../services/inventoryService'
import type { CreateInventoryRequest } from '../../types/type'

export function AdminCreateInventoryPage() {
  const catalog = useProducts()
  const mutation = useMutation(createInventory)
  const navigate = useNavigate()
  async function save(values: CreateInventoryRequest) {
    const result = await mutation.execute(values)
    navigate('/admin/inventario', { replace: true, state: { inventorySaved: result.product_id } })
  }
  return <section>
    <div className="section-heading"><h2>Registrar inventario</h2></div>
    {catalog.loading && <p role="status">Cargando sugerencias de productos…</p>}
    {catalog.error && <p className="notice">No se pudo cargar el catálogo. Puedes introducir el ID del producto.{' '}
      <button className="text-button" onClick={catalog.refetch}>Reintentar catálogo</button></p>}
    <InventoryForm products={catalog.products} loading={mutation.loading} onSave={save} />
  </section>
}

export function AdminEditInventoryPage() {
  const { id } = useParams()
  return <EditInventory key={id} productId={Number(id)} />
}

function EditInventory({ productId }: { productId: number }) {
  const inventory = useInventory(productId)
  const catalog = useProducts()
  const mutation = useMutation(updateInventory)
  const navigate = useNavigate()
  async function save(values: CreateInventoryRequest) {
    const result = await mutation.execute(productId, { stock: values.stock, reorder_point: values.reorder_point })
    navigate('/admin/inventario', { replace: true, state: { inventorySaved: result.product_id } })
  }
  return <section>
    <div className="section-heading"><h2>Ajustar inventario #{productId}</h2></div>
    {inventory.loading ? <PageSkeleton /> : inventory.error ?
      <ErrorState message={inventory.error} retry={inventory.refetch} /> :
      !inventory.data ? <EmptyState title="Inventario no disponible" message="Revisa el identificador del producto."
        href="/admin/inventario" action="Volver al inventario" /> :
      <InventoryForm item={inventory.data} products={catalog.products} loading={mutation.loading} onSave={save} />}
  </section>
}
