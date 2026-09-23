import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { EmptyState } from './components/common/States'
import { HomePage } from './pages/HomePage'
import { CatalogPage } from './pages/CatalogPage'
import { ProductPage } from './pages/ProductPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrdersPage } from './pages/OrdersPage'
import { OrderDetailPage } from './pages/OrderDetailPage'
import { HelpPage } from './pages/HelpPage'
import { AdminLayout } from './components/admin/AdminLayout'
import { CompatibilityPage } from './pages/CompatibilityPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminCreateProductPage, AdminEditProductPage } from './pages/admin/AdminProductFormPage'
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage'
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage'
import './App.css'
import './management.css'
export default function App() {
  return <Routes><Route element={<Layout />}>
    <Route index element={<HomePage />} />
    <Route path="productos" element={<CatalogPage />} />
    <Route path="productos/:id" element={<ProductPage />} />
    <Route path="carrito" element={<CartPage />} />
    <Route path="compatibilidad" element={<CompatibilityPage />} />
    <Route path="ayuda" element={<HelpPage />} />
    <Route path="checkout" element={<CheckoutPage />} />
    <Route path="pedidos" element={<OrdersPage />} />
    <Route path="pedidos/:id" element={<OrderDetailPage />} />
    <Route path="analitica" element={<div className="container page"><AdminAnalyticsPage /></div>} />
    <Route path="admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboardPage />} />
      <Route path="productos" element={<AdminProductsPage />} />
      <Route path="productos/nuevo" element={<AdminCreateProductPage />} />
      <Route path="productos/:id/editar" element={<AdminEditProductPage />} />
      <Route path="pedidos" element={<AdminOrdersPage />} />
      <Route path="pedidos/:id" element={<OrderDetailPage />} />
      <Route path="analitica" element={<AdminAnalyticsPage />} />
    </Route>
    <Route path="*" element={<div className="container page"><EmptyState
      title="Página no disponible" message="Consulta las secciones disponibles de la tienda."
      href="/" action="Volver al inicio" /></div>} />
  </Route></Routes>
}
