import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import axios from 'axios'
import { identityApi, setAccessToken } from '../api/axios'
import { getApiErrorMessage } from '../api/errors'
import * as authService from '../services/authService'
import type { AuthRequest, UserProfile } from '../types/type'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const generation = useRef(0)
  const busy = useRef(false)

  const logout = useCallback(() => {
    generation.current += 1
    setAccessToken(null)
    setUser(null)
    setError(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    const interceptor = identityApi.interceptors.response.use(
      (response) => response,
      (failure: unknown) => {
        if (
          axios.isAxiosError(failure) &&
          failure.response?.status === 401 &&
          failure.config?.url === '/api/auth/me'
        )
          logout()
        return Promise.reject(failure)
      },
    )
    return () => {
      identityApi.interceptors.response.eject(interceptor)
      generation.current += 1
      setAccessToken(null)
    }
  }, [logout])

  const login = useCallback(async (credentials: AuthRequest) => {
    if (busy.current)
      throw new Error('Ya hay una operación de autenticación en curso')
    busy.current = true
    const current = ++generation.current
    setLoading(true)
    setError(null)
    setUser(null)
    setAccessToken(null)
    try {
      const result = await authService.login(credentials)
      if (current !== generation.current)
        throw new Error('Inicio de sesión cancelado')
      setAccessToken(result.access_token)
      const profile = await authService.getProfile()
      if (current !== generation.current)
        throw new Error('Inicio de sesión cancelado')
      setUser(profile)
      return profile
    } catch (failure) {
      if (current === generation.current) {
        setAccessToken(null)
        setUser(null)
        setError(getApiErrorMessage(failure))
      }
      throw failure
    } finally {
      busy.current = false
      if (current === generation.current) setLoading(false)
    }
  }, [])

  const register = useCallback(async (credentials: AuthRequest) => {
    if (busy.current)
      throw new Error('Ya hay una operación de autenticación en curso')
    busy.current = true
    const current = generation.current
    setLoading(true)
    setError(null)
    try {
      return await authService.register(credentials)
    } catch (failure) {
      if (current === generation.current) setError(getApiErrorMessage(failure))
      throw failure
    } finally {
      busy.current = false
      if (current === generation.current) setLoading(false)
    }
  }, [])
  const clearError=()=>{
    setError('');
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        loading,
        error,
        login,
        register,
        clearError,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
