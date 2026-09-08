import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProducts } from '../hooks'
import { Hero } from '../components/home/Hero'
import { CategoryGrid } from '../components/home/CategoryGrid'
import { FeaturedProducts } from '../components/home/FeaturedProducts'
import { PromoBanner } from '../components/home/PromoBanner'
export function HomePage() {
  const { products, loading, error, refetch } = useProducts()
  const affordable = [...products]
    .sort((a, b) => Number(a.price) - Number(b.price))
    .slice(0, 5)
  const brands = [...new Set(products.map((product) => product.brand))]
  return (
    <div className="container home">
      <Hero />
      <section className="benefits" aria-label="Información para tu compra">
        {[
          {
            icon: Truck,
            title: 'Envíos',
            text: 'Consulta los importes de tu pedido',
          },
          {
            icon: ShieldCheck,
            title: 'Tu cuenta',
            text: 'Un espacio para tus compras',
          },
          {
            icon: RotateCcw,
            title: 'Tus pedidos',
            text: 'Consulta su estado en un lugar',
          },
          {
            icon: Headphones,
            title: 'Antes de comprar',
            text: 'Conoce cómo funciona la tienda',
          },
        ].map((item) => (
          <Link to="/ayuda" key={item.title}>
            <item.icon size={25} strokeWidth={1.5} />
            <span>
              <strong>{item.title}</strong>
              <small>{item.text}</small>
            </span>
          </Link>
        ))}
      </section>
      <section className="home-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ENCUENTRA LO QUE TE MUEVE</span>
            <h2>Un mundo de posibilidades</h2>
          </div>
          <Link className="text-link" to="/productos">
            Todas las categorías
            <ArrowRight size={16} />
          </Link>
        </div>
        <CategoryGrid />
      </section>
      <FeaturedProducts
        title="Grandes upgrades, a tu alcance"
        eyebrow="EXPLORA PRECIOS · DE MENOR A MAYOR"
        products={affordable}
        loading={loading}
        error={error}
        retry={refetch}
        href="/productos?sort=price-asc"
        id="precios"
      />
      <FeaturedProducts
        title="Hardware que marca la diferencia"
        eyebrow="DESTACADOS DEL CATÁLOGO"
        products={products.slice(0, 5)}
        loading={loading}
        error={error}
        retry={refetch}
      />
      <PromoBanner />
      <section className="home-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CADA COMPONENTE CUENTA</span>
            <h2>
              Arma tu setup<span className="accent">.</span>
            </h2>
            <p>Empieza por una categoría. Dale forma a tu próxima PC.</p>
          </div>
          <span className="section-number">01 — 06</span>
        </div>
        <CategoryGrid setup />
      </section>
      <FeaturedProducts
        title="Sigue explorando"
        eyebrow="MÁS POSIBILIDADES PARA TU SETUP"
        products={products.slice(-5).reverse()}
        loading={loading}
        error={error}
        retry={refetch}
      />
      {!error && brands.length > 0 && (
        <section className="brands-section">
          <span className="eyebrow">MARCAS EN NUESTRO CATÁLOGO</span>
          <div>
            {brands.map((brand) => (
              <Link
                key={brand}
                to={`/productos?brand=${encodeURIComponent(brand)}`}
              >
                {brand}
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="final-cta">
        <span className="cta-icon">
          <Zap size={30} />
        </span>
        <div>
          <span className="eyebrow">TU PRÓXIMO UPGRADE TE ESPERA</span>
          <h2>Haz espacio para algo extraordinario.</h2>
        </div>
        <Link to="/productos" className="button">
          Encuentra tu componente
          <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  )
}
