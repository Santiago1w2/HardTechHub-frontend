import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks'
export function RequireAuth() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      replace
      state={{
        from: location.pathname,
        message:
          'Inicia sesión para consultar tu cuenta y continuar con tus pedidos.',
      }}
    />
  )
}
