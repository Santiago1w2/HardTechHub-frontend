import type { Product } from '../../types/type'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'
export function ProductGrid({
  products,
  loading = false,
  compact = false,
}: {
  products: Product[]
  loading?: boolean
  compact?: boolean
}) {
  return (
    <div
      className={`product-grid ${compact ? 'catalog-grid' : ''}`}
      aria-busy={loading}
    >
      {loading
        ? Array.from({ length: compact ? 8 : 5 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))
        : products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
    </div>
  )
}
