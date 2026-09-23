import { useProducts } from '../../hooks/useProducts'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categoryInfo, categoryHref } from '../../data/categories'
import { AssetImage } from '../common/AssetImage'
export function CategoryGrid({ setup = false }: { setup?: boolean }) {
  const { products } = useProducts()
  const categories = [...new Set(products.map(p => p.category))].map(value => ({value, label: value, icon: ArrowUpRight, asset: '', ...categoryInfo(value)}))
  const selected = categories
  return (
    <div className={`category-grid ${setup ? 'setup-grid': ''}`}>
      {selected.map((item, index) => (
        <Link
          key={item.value}
          className="category-card"
          to={categoryHref(item.value)}
        >
          {setup && <span className="setup-number">0{index + 1}</span>}
          <AssetImage
            name={`categories/${item.asset}.webp`}
            alt={item.label}
            fallback={<item.icon size={42} strokeWidth={1} />}
          />
          <span>{item.label}</span>
          <ArrowUpRight size={14} className="category-arrow" />
        </Link>
      ))}
    </div>
  )
}
