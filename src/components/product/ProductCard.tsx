import { ArrowUpRight, Check, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/type'
import { formatPrice } from '../../utils/formatPrice'
import { useProductPurchase } from '../../hooks/useProductPurchase'
import { ProductImage } from './ProductImage'
export function ProductCard({ product }: { product: Product }) {
  const { add, feedback, failed } = useProductPurchase()
  return (
    <article className="product-card">
      <Link
        to={`/productos/${product.id}`}
        className="product-visual"
        aria-label={`Ver ${product.name}`}
      >
        <span className="category-tag">{product.category}</span>
        <ProductImage
          src={product.image_url}
          name={product.name}
          category={product.category}
        />
        <ArrowUpRight className="product-arrow" size={18} />
      </Link>
      <div className="product-card-body">
        <span className="eyebrow brand-label">{product.brand}</span>
        <h3>
          <Link to={`/productos/${product.id}`}>{product.name}</Link>
        </h3>
        <span className="product-sku">{product.sku}</span>
        <div className="product-price">{formatPrice(product.price)}</div>
        <button className="button card-add" onClick={() => add(product)}>
          {feedback && !failed ? <Check size={17} /> : <Plus size={17} />}Añadir
          al carrito
        </button>
        <span
          className={`card-feedback ${failed ? 'text-error' : ''}`}
          role="status"
        >
          {feedback}
        </span>
      </div>
    </article>
  )
}
