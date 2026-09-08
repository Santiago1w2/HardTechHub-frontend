import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
export function Breadcrumb({
  current,
  parent,
}: {
  current: string
  parent?: { label: string; href: string }
}) {
  return (
    <nav className="breadcrumb" aria-label="Ruta de navegación">
      <Link to="/">Inicio</Link>
      <ChevronRight size={12} />
      {parent && (
        <>
          <Link to={parent.href}>{parent.label}</Link>
          <ChevronRight size={12} />
        </>
      )}
      <span aria-current="page">{current}</span>
    </nav>
  )
}
