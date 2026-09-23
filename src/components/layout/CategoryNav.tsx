import { useProducts } from '../../hooks/useProducts'
import { ArrowUpRight, Grid2X2, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categoryInfo, categoryHref } from '../../data/categories'
export function CategoryNav() {
  const { products } = useProducts()
  const categories = [...new Set(products.map(p => p.category))].map(value => ({value, label: categoryInfo(value)?.label ?? value}))
  return (
    <nav className="category-nav" aria-label="Categorías principales">
      <div className="container category-nav-inner">
        <Link className="all-categories" to="/productos">
          <Grid2X2 size={16} />
          Todas las categorías
        </Link>
        {categories
          .filter((item) => !['Laptop', 'PSU'].includes(item.value))
          .map((item) => (
            <Link key={item.value} to={categoryHref(item.value)}>
              {item.value === 'RAM' ? 'RAM' : item.label}
            </Link>
          ))}
        <Link to="/compatibilidad">Compatibilidad</Link>
        <Link className="offers-link" to="/productos?sort=price-asc">
          <Zap size={14} />
          Explora precios
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </nav>
  )
}
