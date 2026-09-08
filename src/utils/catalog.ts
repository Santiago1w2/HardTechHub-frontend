import type { Product } from '../types/type'
export function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}
export function matchesSearch(product: Product, query: string): boolean {
  return normalize([product.name, product.brand, product.category, product.sku].join(' ')).includes(normalize(query))
}
export function filterProducts(products: Product[], params: URLSearchParams): Product[] {
  const category = params.get('category') || ''
  const brand = params.get('brand') || ''
  const min = params.get('minPrice') || ''
  const max = params.get('maxPrice') || ''
  const result = products.filter(product => matchesSearch(product, params.get('q') || '') &&
    (!category || normalize(product.category) === normalize(category)) &&
    (!brand || normalize(product.brand) === normalize(brand)) &&
    (!min || Number(product.price) >= Number(min)) && (!max || Number(product.price) <= Number(max)))
  switch (params.get('sort')) {
    case 'price-asc': return result.sort((a, b) => Number(a.price) - Number(b.price))
    case 'price-desc': return result.sort((a, b) => Number(b.price) - Number(a.price))
    case 'name': return result.sort((a, b) => a.name.localeCompare(b.name, 'es'))
    default: return result
  }
}
export function specValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (Array.isArray(value)) return value.map(specValue).join(', ')
  if (value && typeof value === 'object') return JSON.stringify(value)
  return '—'
}
export function formatDate(value: string | null): string {
  if (!value) return 'No disponible'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'No disponible' : new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(date)
}
