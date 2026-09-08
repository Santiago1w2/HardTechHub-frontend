import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { RequireAuth } from './components/common/RequireAuth'
import { EmptyState } from './components/common/States'
import { HomePage } from './pages/HomePage'
import { CatalogPage } from './pages/CatalogPage'
import { ProductPage } from './pages/ProductPage'
import { CartPage } from './pages/CartPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrdersPage } from './pages/OrdersPage'
import { OrderDetailPage } from './pages/OrderDetailPage'
import { ProfilePage } from './pages/ProfilePage'
import { HelpPage } from './pages/HelpPage'
import './App.css'
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="productos" element={<CatalogPage />} />
        <Route path="productos/:id" element={<ProductPage />} />
        <Route path="carrito" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="registro" element={<RegisterPage />} />
        <Route path="ayuda" element={<HelpPage />} />
        <Route element={<RequireAuth />}>
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="pedidos" element={<OrdersPage />} />
          <Route path="pedidos/:id" element={<OrderDetailPage />} />
          <Route path="perfil" element={<ProfilePage />} />
        </Route>
        <Route
          path="*"
          element={
            <div className="container page">
              <EmptyState
                title="Esta página no está en el catálogo"
                message="Vuelve al inicio y encuentra tu próximo upgrade."
                href="/"
                action="Volver al inicio"
              />
            </div>
          }
        />
      </Route>
    </Routes>
  )
}
