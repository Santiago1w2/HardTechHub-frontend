import { useState } from 'react'
import { Cpu } from 'lucide-react'
import { categoryInfo } from '../../data/categories'
function ImageContent({
  src,
  name,
  category,
}: {
  src: string | null
  name: string
  category?: string
}) {
  const [failed, setFailed] = useState(false)
  const Icon = categoryInfo(category || '')?.icon || Cpu
  return src && !failed ? (
    <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} />
  ) : (
    <div className="product-fallback">
      <Icon size={56} strokeWidth={1} aria-hidden="true" />
      <span>Imagen no disponible</span>
    </div>
  )
}
export function ProductImage({
  src,
  name,
  category,
  className = '',
}: {
  src: string | null
  name: string
  category?: string
  className?: string
}) {
  return (
    <div className={`product-image ${className}`}>
      <ImageContent key={src} src={src} name={name} category={category} />
    </div>
  )
}
