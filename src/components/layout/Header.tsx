import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Search,
  ShoppingCart,
  Package,
  Menu,
  X,
  ArrowRight,
  Settings,
} from 'lucide-react'
import icon2 from '../../assets/icon2.png'

import { useCart, useProducts } from '../../hooks'
import { matchesSearch } from '../../utils/catalog'
import { formatPrice } from '../../utils/formatPrice'
import { ProductImage } from '../product/ProductImage'
export function Wordmark() {
  return (
    <Link className="wordmark" to="/" aria-label="HardTech Hub, inicio">
      <img
        src={icon2}
        alt="HardTech Hub"
        className="h-16 w-auto object-contain"
      />
    </Link>
  )
}
function SearchBox() {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState(
    new URLSearchParams(location.search).get('q') || '',
  )
  const [open, setOpen] = useState(false)
  const { products } = useProducts()
  const suggestions = query.trim()
    ? products.filter((product) => matchesSearch(product, query)).slice(0, 5)
    : []
  function submit(event: FormEvent) {
    event.preventDefault()
    setOpen(false)
    navigate(`/productos?q=${encodeURIComponent(query.trim())}`)
  }
  return (
    <div
      className="search-wrap"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <form className="search-form" role="search" onSubmit={submit}>
        <label className="sr-only" htmlFor="global-search">
          Buscar productos, marcas o categorías
        </label>
        <input
          id="global-search"
          autoComplete="off"
          placeholder="Busca tu próximo upgrade…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setOpen(false)
          }}
        />
        <button type="submit" aria-label="Buscar">
          <Search size={20} />
        </button>
      </form>
      {open && suggestions.length > 0 && (
        <div className="search-suggestions">
          <span className="eyebrow">En el catálogo</span>
          {suggestions.map((product) => (
            <Link
              key={product.id}
              to={`/productos/${product.id}`}
              onClick={() => setOpen(false)}
            >
              <ProductImage
                src={product.image_url}
                name={product.name}
                category={product.category}
              />
              <span>
                {product.name}
                <strong>{formatPrice(product.price)}</strong>
              </span>
              <ArrowRight size={15} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
export function Header() {
 const { totalItems } = useCart()
 const [menu, setMenu] = useState(false)
 const location = useLocation()
 return <header className="site-header"><div className="container header-inner">
 <button className="icon-button mobile-menu-toggle" aria-label="Abrir navegación" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
 <Wordmark /><SearchBox key={location.pathname + location.search} />
 <div className="header-actions">
 <Link className="header-action" to="/admin"><Settings size={23}/><span>Gestionar</span></Link>
 <Link className="header-action" to="/analitica"><span>Analítica</span></Link>
 <Link className="header-action orders-action" to="/pedidos"><Package size={23}/><span>Pedidos</span></Link>
 <Link className="cart-link" to="/carrito" aria-label={`Carrito, ${totalItems} productos`}><ShoppingCart size={25}/><span className="cart-count">{totalItems}</span></Link>
 </div></div>{menu && <nav className="mobile-menu" aria-label="Navegación móvil">
 {[['/productos','Productos'],['/compatibilidad','Compatibilidad'],['/pedidos','Pedidos'],['/analitica','Analítica'],['/admin','Gestionar']].map(([path,label]) => <Link key={path} to={path} onClick={()=>setMenu(false)}>{label}</Link>)}
 </nav>}</header>
}
