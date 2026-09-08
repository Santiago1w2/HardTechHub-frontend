import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Search,
  ShoppingCart,
  UserRound,
  Package,
  Menu,
  X,
  ArrowRight,
  LogOut,
  Cpu,
} from 'lucide-react'
import { useAuth, useCart, useProducts } from '../../hooks'
import { categories, categoryHref } from '../../data/categories'
import { matchesSearch } from '../../utils/catalog'
import { formatPrice } from '../../utils/formatPrice'
import { ProductImage } from '../product/ProductImage'
export function Wordmark() {
  return (
    <Link className="wordmark" to="/" aria-label="HardTech Hub, inicio">
      <span className="wordmark-icon">
        <Cpu size={24} />
      </span>
      <span>
        HARDTECH
        <span className="wordmark-hub">
          HUB<span className="logo-dot">.</span>
        </span>
      </span>
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
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const [menu, setMenu] = useState(false)
  const location = useLocation()
  return (
    <header className="site-header">
      <div className="container header-inner">
        <button
          className="icon-button mobile-menu-toggle"
          aria-label={menu ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menu}
          aria-controls="mobile-menu"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
        <Wordmark />
        <SearchBox key={location.pathname + location.search} />
        <div className="header-actions">
          <Link
            className="header-action account-action"
            to={user ? '/perfil' : '/login'}
          >
            <UserRound size={23} />
            <span>
              <small>
                {user ? 'Hola, ' + user.email.split('@')[0] : 'Bienvenido'}
              </small>
              {user ? 'Mi cuenta' : 'Iniciar sesión'}
            </span>
          </Link>
          <Link className="header-action orders-action" to="/pedidos">
            <Package size={23} />
            <span>
              <small>Consulta tus</small>Pedidos
            </span>
          </Link>
          <Link
            className="cart-link"
            to="/carrito"
            aria-label={`Carrito, ${totalItems} productos`}
          >
            <ShoppingCart size={25} />
            <span className="cart-count">{totalItems}</span>
          </Link>
        </div>
      </div>
      {menu && (
        <nav
          id="mobile-menu"
          className="mobile-menu"
          aria-label="Menú móvil"
          onKeyDown={(event) => {
            if (event.key === 'Escape') setMenu(false)
          }}
        >
          <Link to="/productos" onClick={() => setMenu(false)}>
            Todos los productos <ArrowRight size={16} />
          </Link>
          {categories.map((item) => (
            <Link
              key={item.value}
              to={categoryHref(item.value)}
              onClick={() => setMenu(false)}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
          <Link to={user ? '/perfil' : '/login'} onClick={() => setMenu(false)}>
            <UserRound size={18} />
            {user ? 'Mi cuenta' : 'Iniciar sesión'}
          </Link>
          <Link to="/pedidos" onClick={() => setMenu(false)}>
            <Package size={18} />
            Mis pedidos
          </Link>
          {user && (
            <button onClick={logout}>
              <LogOut size={18} />
              Cerrar sesión
            </button>
          )}
        </nav>
      )}
    </header>
  )
}
