import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/type'
import { ProductGrid } from '../product/ProductGrid'
import { EmptyState, ErrorState } from '../common/States'
export function FeaturedProducts({
  title,
  eyebrow,
  products,
  loading,
  error,
  retry,
  href = '/productos',
  id,
}: {
  title: string
  eyebrow: string
  products: Product[]
  loading: boolean
  error: string | null
  retry: () => void
  href?: string
  id?: string
}) {
  return (
    <section className="home-section" id={id}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <Link className="text-link" to={href}>
          Ver todo
          <ArrowRight size={16} />
        </Link>
      </div>
      {error ? (
        <ErrorState message={error} retry={retry} />
      ) : !loading && !products.length ? (
        <EmptyState
          title="Próximos componentes, nuevas posibilidades"
          message="El catálogo todavía no tiene productos para mostrar."
        />
      ) : (
        <ProductGrid products={products} loading={loading} />
      )}
    </section>
  )
}
