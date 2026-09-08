import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnnouncementBar } from './AnnouncementBar'
import { Header } from './Header'
import { CategoryNav } from './CategoryNav'
import { Footer } from './Footer'
export function Layout() {
  const { pathname, hash } = useLocation()
  const main = useRef<HTMLElement>(null)
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else {
      window.scrollTo(0, 0)
      main.current?.focus({ preventScroll: true })
    }
  }, [pathname, hash])
  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido
      </a>
      <AnnouncementBar />
      <Header />
      <CategoryNav />
      <main ref={main} tabIndex={-1} id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
