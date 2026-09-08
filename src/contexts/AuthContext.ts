import { createContext } from 'react'
import type { AuthRequest, RegisterResponse, UserProfile } from '../types/type'

export interface AuthContextValue {
  user: UserProfile | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (credentials: AuthRequest) => Promise<UserProfile>
  register: (credentials: AuthRequest) => Promise<RegisterResponse>
  clearError:()=>void;
  logout: () => void
}
export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
