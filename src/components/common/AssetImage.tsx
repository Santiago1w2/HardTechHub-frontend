import { useState, type ReactNode } from 'react'
const assets = import.meta.glob('../../assets/**/*.{webp,png,jpg,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>
export function AssetImage({
  name,
  alt,
  fallback,
  className = '',
}: {
  name: string
  alt: string
  fallback?: ReactNode
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const src = assets[`../../assets/${name}`]
  return (
    <div className={`asset-image ${className}`}>
      {src && !failed ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setFailed(true)} />
      ) : (
        fallback
      )}
    </div>
  )
}
