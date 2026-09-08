import { ArrowRight, ArrowUpRight, Cpu, Laptop, Microchip } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AssetImage } from '../common/AssetImage'
export function Hero() {
  return (
    <section className="hero-grid" aria-label="Descubre HardTech Hub">
      <div className="hero-main">
        <div className="hero-gridlines" aria-hidden="true" />
        <div className="hero-copy">
          <span className="eyebrow hero-kicker">
            <span /> EL SIGUIENTE NIVEL ES TUYO
          </span>
          <h1>
            POTENCIA
            <br />
            TU <em>MUNDO.</em>
          </h1>
          <p>
            Componentes de alto rendimiento para llevar tu experiencia al
            siguiente nivel.
          </p>
          <Link className="button" to="/productos">
            Explorar componentes
            <ArrowRight size={18} />
          </Link>
          <span className="hero-caption">
            PARA JUGAR. PARA CREAR. PARA IR MÁS ALLÁ.
          </span>
        </div>
        <AssetImage
          name="logo1.jpg"
          alt="Setup gaming de HardTech Hub"
          className="hero-main-art"
          fallback={
            <div className="tech-art" aria-hidden="true">
              <div className="tech-orbit orbit-one" />
              <div className="tech-orbit orbit-two" />
              <div className="tech-chip">
                <Cpu size={100} strokeWidth={0.7} />
                <span>HARDTECH</span>
              </div>
              <span className="tech-coordinate">PERFORMANCE / 01</span>
            </div>
          }
        />
      </div>
      <div className="hero-side">
        <Link to="/productos?category=GPU" className="mini-banner gpu-banner">
          <span className="eyebrow">MÁS ALLÁ DE LOS PÍXELES</span>
          <h2>
            GPU de nueva
            <br />
            generación<span>.</span>
          </h2>
          <span className="text-link">
            Explorar gráficas
            <ArrowUpRight size={16} />
          </span>
          <AssetImage
            name="banners/hero-gpu.webp"
            alt="Tarjeta gráfica"
            fallback={<Microchip size={115} strokeWidth={0.7} />}
          />
        </Link>
        <Link
          to="/productos?category=Laptop"
          className="mini-banner laptop-banner"
        >
          <span className="eyebrow">TU POTENCIA, CONTIGO</span>
          <h2>
            Laptops para
            <br />
            todo tu potencial<span>.</span>
          </h2>
          <span className="text-link">
            Ver laptops
            <ArrowUpRight size={16} />
          </span>
          <AssetImage
            name="banners/hero-laptop.webp"
            alt="Laptop de alto rendimiento"
            fallback={<Laptop size={125} strokeWidth={0.7} />}
          />
        </Link>
      </div>
    </section>
  )
}
