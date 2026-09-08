import { categories } from '../../data/categories'
import type { Product } from '../../types/type'
export function ProductFilters({
  products,
  params,
  update,
  reset,
}: {
  products: Product[]
  params: URLSearchParams
  update: (key: string, value: string) => void
  reset: () => void
}) {
  const brands = [...new Set(products.map((product) => product.brand))].sort()
  const choices = [
    ...categories.map((item) => ({ value: item.value, label: item.label })),
    ...[...new Set(products.map((product) => product.category))]
      .filter((value) => !categories.some((item) => item.value === value))
      .map((value) => ({ value, label: value })),
  ]
  return (
    <div className="filter-content">
      <div className="filter-heading">
        <h2>Filtros</h2>
        <button className="text-button" onClick={reset}>
          Limpiar
        </button>
      </div>
      <fieldset>
        <legend>Categoría</legend>
        <label className="radio-label">
          <input
            type="radio"
            name="category"
            checked={!params.get('category')}
            onChange={() => update('category', '')}
          />
          Todas las categorías<span>{products.length}</span>
        </label>
        {choices.map((item) => (
          <label className="radio-label" key={item.value}>
            <input
              type="radio"
              name="category"
              checked={params.get('category') === item.value}
              onChange={() => update('category', item.value)}
            />
            {item.label}
            <span>
              {
                products.filter(
                  (product) =>
                    product.category.toLowerCase() === item.value.toLowerCase(),
                ).length
              }
            </span>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Marca</legend>
        <select
          aria-label="Filtrar por marca"
          value={params.get('brand') || ''}
          onChange={(event) => update('brand', event.target.value)}
        >
          <option value="">Todas las marcas</option>
          {brands.map((brand) => (
            <option key={brand}>{brand}</option>
          ))}
        </select>
      </fieldset>
      <fieldset>
        <legend>Precio (S/)</legend>
        <div className="price-inputs">
          <label>
            Desde
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={params.get('minPrice') || ''}
              onChange={(event) => update('minPrice', event.target.value)}
            />
          </label>
          <span>—</span>
          <label>
            Hasta
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Máximo"
              value={params.get('maxPrice') || ''}
              onChange={(event) => update('maxPrice', event.target.value)}
            />
          </label>
        </div>
      </fieldset>
      <div className="filter-note">
        Se muestran productos activos del catálogo. La disponibilidad de
        unidades no está informada.
      </div>
    </div>
  )
}
