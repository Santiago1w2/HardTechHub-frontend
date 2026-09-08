import { ArrowRight, CircuitBoard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AssetImage } from '../common/AssetImage'
export function PromoBanner() {
  return (
    <section className="promo-banner">
      <div>
        <span className="eyebrow">TU PRÓXIMA GRAN IDEA EMPIEZA AQUÍ</span>
        <h2>
          Construye
          <br />
          sin <em>límites.</em>
        </h2>
        <p>Encuentra los componentes que tu próxima PC necesita.</p>
        <Link to="/productos" className="button button-light">
          Explorar componentes
          <ArrowRight size={17} />
        </Link>
      </div>
      <AssetImage
        name="banners/setup-banner.webp"
        alt="Componentes para construir una PC"
        fallback={
          <div className="promo-circuit" aria-hidden="true">
            <CircuitBoard size={190} strokeWidth={0.65} />
            <span>BUILD YOUR NEXT.</span>
          </div>
        }
      />
      <span className="promo-side-label" aria-hidden="true">
        HARDTECH / BUILD SERIES
      </span>
    </section>
  )
}
