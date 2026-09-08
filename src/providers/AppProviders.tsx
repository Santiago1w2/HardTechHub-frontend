import type { ReactNode } from 'react'
import { AuthProvider } from '../contexts/AuthProvider'
import { CartProvider } from '../contexts/CartProvider'
import { useAuth } from '../hooks/useAuth'

function SessionCart({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  return <CartProvider key={user?.user_id ?? 'guest'}>{children}</CartProvider>
}
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SessionCart>{children}</SessionCart>
    </AuthProvider>
  )
}
