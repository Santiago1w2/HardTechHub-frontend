import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ProductForm } from '../../components/admin/ProductForm'
import {
  ErrorState,
  PageSkeleton,
  EmptyState,
} from '../../components/common/States'
import { useProduct } from '../../hooks/useProduct'
import { useCatalogOptions } from '../../hooks/useCatalogOptions'
import { useCreateProduct } from '../../hooks/useCreateProduct'
import { useUpdateProduct } from '../../hooks/useUpdateProduct'
import {
  buildCreateProduct,
  buildProductUpdate,
  type ProductFormValues,
} from '../../utils/productForm'

export function AdminCreateProductPage() {
  const { submitProduct, loading } = useCreateProduct()
  const options = useCatalogOptions()
  const navigate = useNavigate()
  async function save(values: ProductFormValues) {
    const result = await submitProduct(buildCreateProduct(values))
    navigate(`/admin/productos/${result.id}/editar`, { replace: true })
  }
  return (
    <section>
      <div className="section-heading">
        <h2>Crear producto</h2>
      </div>
      {options.loading ? (
        <PageSkeleton />
      ) : options.error ? (
        <ErrorState message={options.error} retry={options.refetch} />
      ) : !options.categories.length || !options.brands.length ? (
        <div className="state-panel">
          <h2>Faltan categorías o marcas</h2>
          <p>
            Registra las categorías y marcas del catálogo antes de crear un
            producto.
          </p>
          <button className="button button-secondary" onClick={options.refetch}>
            Actualizar
          </button>
        </div>
      ) : (
        <ProductForm
          loading={loading}
          onSave={save}
          categories={options.categories}
          brands={options.brands}
        />
      )}
    </section>
  )
}

export function AdminEditProductPage() {
  const { id } = useParams()
  return <EditProduct key={id} id={id} />
}

function EditProduct({ id }: { id: string | undefined }) {
  const { product, loading, error, refetch } = useProduct(Number(id))
  const { updateProduct, loading: saving } = useUpdateProduct()
  const [message, setMessage] = useState('')
  async function save(values: ProductFormValues) {
    if (!product) return
    const changes = buildProductUpdate(values, product)
    if (!Object.keys(changes).length) {
      setMessage('No hay cambios para guardar.')
      return
    }
    await updateProduct(product.id, changes)
    setMessage('Producto actualizado.')
    refetch()
  }
  return (
    <section>
      <div className="section-heading">
        <h2>Editar producto #{id}</h2>
      </div>
      {message && (
        <p className="success-banner" role="status">
          {message}
        </p>
      )}
      {loading ? (
        <PageSkeleton />
      ) : error ? (
        <ErrorState message={error} retry={refetch} />
      ) : !product ? (
        <EmptyState
          title="Producto no disponible"
          message="Revisa el identificador del producto."
          href="/admin/productos"
          action="Volver a productos"
        />
      ) : (
        <ProductForm
          key={product.id}
          product={product}
          loading={saving}
          onSave={save}
        />
      )}
    </section>
  )
}
