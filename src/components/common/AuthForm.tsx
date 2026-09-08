import { useState, type FormEvent, useEffect } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Cpu, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../hooks'
import { AssetImage } from './AssetImage'
import { LoadingSpinner } from './States'
import { getApiErrorMessage } from '../../api/errors'
import type { AuthRequest } from '../../types/type'
export function AuthForm({ registerMode = false }: { registerMode?: boolean }) {
  const { login, register, loading, error, isAuthenticated, clearError } = useAuth()
  const [requestForm, setRequestForm]=useState<AuthRequest>({
    email:'',
    password:''
  });
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const [created, setCreated] = useState(false)
  const state = location.state as { from?: string; message?: string } | null
  const destination =
    state?.from?.startsWith('/') &&
    !state.from.startsWith('//') &&
    !['/login', '/registro'].includes(state.from)? state.from: '/productos'

  if (isAuthenticated) return <Navigate to={destination} replace />
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    clearError()
    setLocalError('')
    try {
      if (registerMode) {
        await register(requestForm)
        setCreated(true)
      } else await login(requestForm)
    } catch (failure) {
      setLocalError(getApiErrorMessage(failure))
    }
  }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      clearError()
      setLocalError('')
        const { name, value } = e.target
        setRequestForm((prev) => ({ ...prev, [name]: value }))
    }

  return (
    <div className="container auth-page">
      <div className="auth-visual">
        <span className="eyebrow">HARDTECH HUB / TU SIGUIENTE NIVEL</span>
        <h1>
          Grandes ideas.
          <br />
          Más potencia.
          <br />
          <em>Tu espacio.</em>
        </h1>
        <p>
          Los componentes para lo que juegas,
          <br />
          lo que creas y lo que viene.
        </p>
        <AssetImage
          name="banners/auth-cover.webp"
          alt="Setup tecnológico oscuro"
          fallback={
            <div className="auth-fallback" aria-hidden="true">
              <Cpu size={160} strokeWidth={0.6} />
              <span>H / H</span>
            </div>
          }
        />
        <span className="auth-visual-footer">
          CONSTRUYE ALGO EXTRAORDINARIO.
        </span>
      </div>
      <div className="auth-form-panel">
        {created ? (
          <div className="auth-success" role="status">
            <CheckCircle2 size={46} />
            <span className="eyebrow">TODO LISTO</span>
            <h2>Tu cuenta ya está creada.</h2>
            <p>Cuenta creada correctamente. Inicia sesión para continuar.</p>
            <Link to="/login" className="button">
              Ir a iniciar sesión
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            <span className="eyebrow">
              {registerMode
                ? 'BIENVENIDO A HARDTECH HUB'
                : 'QUÉ BUENO TENERTE DE VUELTA'}
            </span>
            <h2>{registerMode ? 'Crea tu cuenta.' : 'Inicia sesión.'}</h2>
            <p>
              {registerMode
                ? 'Tu próxima PC merece un buen comienzo.'
                : 'Tu cuenta, tus componentes, tu próximo upgrade.'}
            </p>
            {!registerMode && state?.message && (
              <p className="notice">{state.message}</p>
            )}
            <form onSubmit={submit}>
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="tu@correo.com"
                value={requestForm.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <label htmlFor="password">Contraseña</label>
              <div className="password-field">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={
                    registerMode ? 'new-password' : 'current-password'
                  }
                  value={requestForm.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  className="icon-button"
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {(localError || error) && (
                <p className="form-error" role="alert">
                  {localError || error}
                </p>
              )}
              <button
                className="button full-width"
                type="submit"
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : <ArrowRight size={18} />}
                {loading
                  ? 'Un momento…'
                  : registerMode
                    ? 'Crear cuenta'
                    : 'Iniciar sesión'}
              </button>
            </form>
            <p className="auth-switch">
              {registerMode
                ? '¿Ya tienes una cuenta?'
                : '¿Primera vez por aquí?'}{' '}
              <Link to={registerMode ? '/login' : '/registro'}>
                {registerMode ? 'Inicia sesión' : 'Crea tu cuenta'}
              </Link>
            </p>
            <div className="auth-session-note">
              Tu sesión se mantiene mientras esta aplicación esté abierta. Al
              recargar tendrás que iniciar sesión nuevamente.
            </div>
          </>
        )}
      </div>
    </div>
  )
}
