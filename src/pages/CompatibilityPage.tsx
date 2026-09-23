import { useState, type FormEvent } from 'react'
import { CheckCircle2, CircuitBoard, AlertTriangle } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useCompatibility } from '../hooks/useCompatibility'
import {
  componentOptions,
  componentTypeForCategory,
} from '../utils/compatibility'
import type { CompatibilityResponse, ComponentType } from '../types/type'
import { Breadcrumb } from '../components/common/Breadcrumb'
import {
  EmptyState,
  ErrorState,
  LoadingSpinner,
  PageSkeleton,
} from '../components/common/States'
import { ProductImage } from '../components/product/ProductImage'
import { formatPrice } from '../utils/formatPrice'
import { getApiErrorMessage } from '../api/errors'

export function CompatibilityPage() {
  const { products, loading, error, refetch } = useProducts()
  const { checkCompatibility, loading: checking } = useCompatibility()
  const [selected, setSelected] = useState<
    Partial<Record<ComponentType, number>>
  >({})
  const [result, setResult] = useState<CompatibilityResponse | null>(null)
  const [failure, setFailure] = useState('')
  const selectedCount = Object.values(selected).filter(Boolean).length

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (checking) return
    setResult(null)
    setFailure('')
    try {
      const components = componentOptions.flatMap(({ type }) => {
        const productId = selected[type]
        return productId ? [{ type, product_id: productId }] : []
      })
      setResult(await checkCompatibility({ components }))
    } catch (error) {
      setFailure(getApiErrorMessage(error))
    }
  }

  return (
    <div className="container page">
      <Breadcrumb current="Compatibilidad" />
      <div className="page-heading">
        <span className="eyebrow">CADA COMPONENTE CUENTA</span>
        <h1>
          Construye tu combinación<span className="accent">.</span>
        </h1>
        <p>
          Selecciona componentes del catálogo y comprueba cómo trabajan juntos.
        </p>
      </div>
      {loading ? (
        <PageSkeleton />
      ) : error ? (
        <ErrorState message={error} retry={refetch} />
      ) : !products.length ? (
        <EmptyState
          title="No hay componentes disponibles"
          message="Vuelve a consultar el catálogo más adelante."
        />
      ) : (
        <form className="purchase-layout" onSubmit={submit}>
          <div className="component-grid">
            {componentOptions.map(({ type, label }) => {
              const options = products.filter(
                (product) =>
                  componentTypeForCategory(product.category) === type,
              )
              const product = options.find((item) => item.id === selected[type])
              return (
                <section
                  className="management-card component-picker"
                  key={type}
                >
                  <label htmlFor={`component-${type}`}>{label}</label>
                  <select
                    id={`component-${type}`}
                    value={selected[type] ?? ''}
                    disabled={checking || !options.length}
                    onChange={(event) => {
                      setSelected((current) => ({
                        ...current,
                        [type]: Number(event.target.value) || undefined,
                      }))
                      setResult(null)
                      setFailure('')
                    }}
                  >
                    <option value="">
                      {options.length
                        ? 'Sin seleccionar'
                        : 'No disponible en el catálogo'}
                    </option>
                    {options.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {product ? (
                    <div className="management-product">
                      <ProductImage
                        src={product.image_url}
                        name={product.name}
                        category={product.category}
                      />
                      <div>
                        <strong>{product.name}</strong>
                        <small>{product.sku}</small>
                        <span className="accent">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="muted">
                      Selecciona un componente para añadirlo a la comprobación.
                    </p>
                  )}
                </section>
              )
            })}
          </div>
          <aside className="cart-summary compatibility-summary">
            <CircuitBoard size={30} className="accent" />
            <h2>Tu combinación</h2>
            <p>{selectedCount} componentes seleccionados.</p>
            <p>
              Puedes comprobar procesador y placa madre, memoria y placa madre,
              o tarjeta gráfica y fuente.
            </p>
            <button
              className="button full-width"
              disabled={checking || !selectedCount}
            >
              {checking && <LoadingSpinner />}
              {checking ? 'Comprobando…' : 'Comprobar compatibilidad'}
            </button>
            {failure && (
              <p className="form-error" role="alert">
                {failure}
              </p>
            )}
            {result && (
              <div
                className={
                  result.compatible
                    ? 'compatibility-result success-banner'
                    : 'compatibility-result notice'
                }
                role="status"
              >
                {result.compatible ? (
                  <CheckCircle2 size={24} />
                ) : (
                  <AlertTriangle size={24} />
                )}
                <div>
                  <strong>
                    {result.compatible
                      ? 'Compatible en las comprobaciones realizadas'
                      : 'Revisa tu combinación'}
                  </strong>
                  <ul>
                    {result.messages.map((message, index) => (
                      <li key={index}>{message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <small>
              El resultado corresponde a los componentes seleccionados y sus
              especificaciones registradas.
            </small>
          </aside>
        </form>
      )}
    </div>
  )
}
