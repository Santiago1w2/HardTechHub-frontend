import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { ProductDetail, CatalogOption } from '../../types/type'
import {
  productFormValues,
  type ProductFormValues,
} from '../../utils/productForm'
import { ConfirmDialog } from '../common/ConfirmDialog'
import { LoadingSpinner } from '../common/States'
import { getApiErrorMessage } from '../../api/errors'

export function ProductForm({
  product,
  categories = [],
  brands = [],
  loading,
  onSave,
}: {
  product?: ProductDetail
  categories?: CatalogOption[]
  brands?: CatalogOption[]
  loading: boolean
  onSave: (values: ProductFormValues) => Promise<void>
}) {
  const [values, setValues] = useState(() => productFormValues(product))
  const [error, setError] = useState('')
  const [confirming, setConfirming] = useState(false)
  function change(field: keyof ProductFormValues, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }))
    setError('')
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    setError('')
    if (product?.is_active && !values.is_active) {
      setConfirming(true)
      return
    }
    await save()
  }
  async function save() {
    try {
      await onSave(values)
      setConfirming(false)
    } catch (failure) {
      setError(getApiErrorMessage(failure))
    }
  }
  return (
    <form className="management-card management-form" onSubmit={submit}>
      <fieldset disabled={loading} className="form-grid">
        <legend className="sr-only">Información del producto</legend>

        {!product && (
          <>
            <label>
              Categoría
              <select
                required
                value={values.category_id}
                onChange={(event) => change('category_id', event.target.value)}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Marca
              <select
                required
                value={values.brand_id}
                onChange={(event) => change('brand_id', event.target.value)}
              >
                <option value="">Selecciona una marca</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        {product && (
          <p className="notice form-wide">
            {product.category} · {product.brand} · SKU: {product.sku}
          </p>
        )}
        {!product && (
          <label>
            SKU
            <input
              required
              maxLength={80}
              value={values.sku}
              onChange={(event) => change('sku', event.target.value)}
            />
          </label>
        )}
        <label>
          Nombre
          <input
            required
            maxLength={180}
            value={values.name}
            onChange={(event) => change('name', event.target.value)}
          />
        </label>
        <label>
          Precio (S/)
          <input
            type="number"
            required
            min="0"
            max="99999999.99"
            step="0.01"
            value={values.price}
            onChange={(event) => change('price', event.target.value)}
          />
        </label>
        <label className="form-wide">
          Descripción
          <textarea
            rows={4}
            value={values.description}
            onChange={(event) => change('description', event.target.value)}
          />
        </label>
        <label className="form-wide">
          Dirección de imagen
          <input
            value={values.image_url}
            onChange={(event) => change('image_url', event.target.value)}
          />
          <small className="muted">
            Opcional. Usa una dirección accesible desde la tienda.
          </small>
        </label>
        <label className="form-wide">
          Especificaciones (JSON)
          <textarea
            className="specs-input"
            rows={8}
            spellCheck={false}
            value={values.specs}
            onChange={(event) => change('specs', event.target.value)}
            aria-describedby="specs-help"
          />
          <small className="muted" id="specs-help">
            Objeto con las propiedades técnicas del producto. Conserva las
            claves utilizadas por el catálogo, como socket, memory_type,
            recommended_psu_watts o wattage.
          </small>
        </label>
        {product && (
          <label>
            Estado
            <select
              value={values.is_active ? 'active' : 'inactive'}
              onChange={(event) =>
                change('is_active', event.target.value === 'active')
              }
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </label>
        )}
      </fieldset>
      {error && !confirming && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="management-actions">
        <button className="button" disabled={loading}>
          {loading && <LoadingSpinner />}
          {loading
            ? 'Guardando…'
            : product
              ? 'Guardar cambios'
              : 'Crear producto'}
        </button>
        {!loading && (
          <Link className="button button-secondary" to="/admin/productos">
            Volver a productos
          </Link>
        )}
      </div>
      {confirming && (
        <ConfirmDialog
          title="¿Desactivar producto?"
          confirmLabel="Guardar y desactivar"
          loading={loading}
          error={error}
          onConfirm={() => {
            void save()
          }}
          onClose={() => {
            setConfirming(false)
            setError('')
          }}
        >
          <p>
            El producto dejará de aparecer en el catálogo. Su información se
            conservará y podrás reactivarlo.
          </p>
        </ConfirmDialog>
      )}
    </form>
  )
}
