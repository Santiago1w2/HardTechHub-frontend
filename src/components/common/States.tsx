import {
  AlertTriangle,
  ArrowRight,
  PackageOpen,
  RotateCcw,
  LoaderCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
export function ErrorState({
  message,
  retry,
}: {
  message: string
  retry?: () => void
}) {
  return (
    <div className="state-panel error-state" role="alert">
      <AlertTriangle size={30} />
      <h3>No pudimos cargar esta información</h3>
      <p>{message}</p>
      {retry && (
        <button className="button button-secondary" onClick={retry}>
          <RotateCcw size={16} /> Reintentar
        </button>
      )}
    </div>
  )
}
export function EmptyState({
  title,
  message,
  href = '/productos',
  action = 'Explorar productos',
}: {
  title: string
  message: string
  href?: string
  action?: string
}) {
  return (
    <div className="state-panel">
      <span className="state-icon">
        <PackageOpen size={38} />
      </span>
      <h2>{title}</h2>
      <p>{message}</p>
      <Link className="button" to={href}>
        {action}
        <ArrowRight size={17} />
      </Link>
    </div>
  )
}
export function LoadingSpinner() {
  return <LoaderCircle className="spin" size={18} aria-label="Cargando" />
}
export function PageSkeleton() {
  return (
    <div
      className="page-skeleton"
      role="status"
      aria-label="Cargando información"
    >
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-wide" />
      <div className="skeleton skeleton-wide" />
      <span className="sr-only">Cargando información</span>
    </div>
  )
}
