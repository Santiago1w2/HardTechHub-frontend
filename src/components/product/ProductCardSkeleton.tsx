export function ProductCardSkeleton() {
  return (
    <div className="product-card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-image" />
      <div className="product-card-body">
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-price" />
        <div className="skeleton skeleton-button" />
      </div>
    </div>
  )
}
export function ProductDetailSkeleton() {
  return (
    <div
      className="product-detail skeleton-detail"
      role="status"
      aria-label="Cargando producto"
    >
      <div className="skeleton detail-image" />
      <div>
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-wide" />
        <div className="skeleton skeleton-wide" />
      </div>
    </div>
  )
}
