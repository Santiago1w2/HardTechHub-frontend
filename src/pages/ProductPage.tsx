import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, ArrowRight, Package, ChevronRight } from 'lucide-react'
import { useProduct } from '../hooks'
import { useProductPurchase } from '../hooks/useProductPurchase'
import { formatPrice } from '../utils/formatPrice'
import { specValue } from '../utils/catalog'
import { ProductImage } from '../components/product/ProductImage'
import { ProductDetailSkeleton } from '../components/product/ProductCardSkeleton'
import { QuantitySelector } from '../components/cart/QuantitySelector'
import { ErrorState, EmptyState } from '../components/common/States'
import { Breadcrumb } from '../components/common/Breadcrumb'
export function ProductPage() {
  const { id } = useParams()
  return <ProductDetail key={id} id={Number(id)} />
}
function ProductDetail({ id }: { id: number }) {
  const { product, loading, error, refetch } = useProduct(id)
  const [quantity, setQuantity] = useState(1)
  const { add, feedback, failed } = useProductPurchase()
  console.log(product);
  return (
    <div className="container page">
      <Breadcrumb
        current={product?.name || 'Detalle del producto'}
        parent={{ label: 'Productos', href: '/productos' }}
      />
      {loading ? (
        <ProductDetailSkeleton />
      ) : error ? (
        <ErrorState message={error} retry={refetch} />
      ) : !product ? (
        <EmptyState
          title="Producto no encontrado"
          message="Explora el catálogo para encontrar tu próximo componente."
        />
      ) : (
        <>
          <div className="product-detail">
            <div className="detail-visual">
              <span className="detail-category">{product.category}</span>
              <ProductImage
                src={product.image_url}
                name={product.name}
                category={product.category}
                className="detail-image"
              />
              <span className="image-caption">
                {product.brand} / {product.sku}
              </span>
            </div>
            <div className="detail-information">
              <Link
                className="eyebrow"
                to={`/productos?brand=${encodeURIComponent(product.brand)}`}
              >
                {product.brand}
                <ChevronRight size={13} />
              </Link>
              <h1>{product.name}</h1>
              <span className="muted">SKU: {product.sku}</span>
              <div className="detail-price">{formatPrice(product.price)}</div>
              <span
                className={`status-badge ${product.is_active ? 'status-paid' : 'status-cancelled'}`}
              >
                {product.is_active
                  ? 'Producto activo en catálogo'
                  : 'Producto inactivo'}
              </span>
              <p className="detail-description">
                {product.description ||
                  'Consulta las especificaciones de este componente a continuación.'}
              </p>
              <div className="detail-quantity">
                <span>Cantidad</span>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  disabled={!product.is_active}
                />
              </div>
              <div className="purchase-actions">
                <button
                  className="button"
                  disabled={!product.is_active}
                  onClick={() => add(product, quantity)}
                >
                  <ShoppingCart size={18} />
                  Añadir al carrito
                </button>
                <button
                  className="button button-secondary"
                  disabled={!product.is_active}
                  onClick={() => add(product, quantity, true)}
                >
                  Comprar ahora
                  <ArrowRight size={17} />
                </button>
              </div>
              <p
                className={failed ? 'text-error' : 'text-success'}
                role="status"
              >
                {feedback}
              </p>
              <div className="detail-note">
                <Package size={19} />
                <span>
                  Impuestos y envío se calculan al confirmar el pedido.
                  <Link to="/ayuda#pedidos">Conoce el proceso de compra</Link>
                </span>
              </div>
            </div>
          </div>
          <section className="specifications">
            <div>
              <span className="eyebrow">CONOCE CADA DETALLE</span>
              <h2>Especificaciones técnicas</h2>
            </div>
            {Object.keys(product.specs).length ? (
              <dl>
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key}>
                    <dt>{key.replaceAll('_', ' ')}</dt>
                    <dd>{specValue(value)}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="muted">
                No hay especificaciones registradas para este producto.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  )
}
