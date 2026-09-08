import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { useProducts } from '../hooks'
import { filterProducts } from '../utils/catalog'
import { categoryInfo } from '../data/categories'
import { ProductGrid } from '../components/product/ProductGrid'
import { ProductFilters } from '../components/product/ProductFilters'
import { ErrorState, EmptyState } from '../components/common/States'
import { Breadcrumb } from '../components/common/Breadcrumb'
export function CatalogPage() {
  const { products, loading, error, refetch } = useProducts()
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filtered = filterProducts(products, params)
  const query = params.get('q')
  const title = query
    ? `Resultados para “${query}”`
    : categoryInfo(params.get('category') || '')?.label ||
      'Todo para tu próximo upgrade'
  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }
  return (
    <div className="container page">
      <Breadcrumb current="Productos" />
      <div className="page-heading">
        <span className="eyebrow">ELIGE. COMBINA. CONSTRUYE.</span>
        <h1>{title}</h1>
        <p>Encuentra el componente que hace la diferencia.</p>
      </div>
      <div className="catalog-layout">
        <aside className={`filters ${filtersOpen ? 'filters-open' : ''}`}>
          <button
            className="filter-close icon-button"
            onClick={() => setFiltersOpen(false)}
            aria-label="Cerrar filtros"
          >
            <X />
          </button>
          <ProductFilters
            products={products}
            params={params}
            update={update}
            reset={() => setParams({})}
          />
        </aside>
        <div className="catalog-results">
          <div className="catalog-toolbar">
            <span>
              <strong>{loading ? '—' : filtered.length}</strong> productos
            </span>
            <button
              className="button button-secondary filter-toggle"
              onClick={() => setFiltersOpen(!filtersOpen)}
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal size={16} />
              Filtros
            </button>
            <label className="sort-control">
              Ordenar por
              <select
                value={params.get('sort') || ''}
                onChange={(event) => update('sort', event.target.value)}
              >
                <option value="">Más relevantes</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name">Nombre A–Z</option>
              </select>
            </label>
          </div>
          {Array.from(params.entries()).filter(([key]) => key !== 'sort')
            .length > 0 && (
            <div className="active-filters">
              {Array.from(params.entries())
                .filter(([key]) => key !== 'sort')
                .map(([key, value]) => (
                  <button key={key} onClick={() => update(key, '')}>
                    {key === 'minPrice'
                      ? 'Desde S/ '
                      : key === 'maxPrice'
                        ? 'Hasta S/ '
                        : ''}
                    {categoryInfo(value)?.label || value}
                    <X size={12} />
                    <span className="sr-only">Quitar filtro</span>
                  </button>
                ))}
            </div>
          )}
          {error ? (
            <ErrorState message={error} retry={refetch} />
          ) : !loading && !filtered.length ? (
            <EmptyState
              title="No encontramos esa combinación"
              message="Prueba con otra categoría, marca o rango de precio."
              href="/productos"
              action="Ver todos los productos"
            />
          ) : (
            <ProductGrid products={filtered} loading={loading} compact />
          )}
        </div>
      </div>
    </div>
  )
}
