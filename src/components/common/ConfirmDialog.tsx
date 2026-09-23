import { useEffect, useRef, type ReactNode } from 'react'
import { LoadingSpinner } from './States'

export function ConfirmDialog({
  title,
  children,
  confirmLabel,
  loading,
  error,
  onConfirm,
  onClose,
}: {
  title: string
  children: ReactNode
  confirmLabel: string
  loading: boolean
  error?: string | null
  onConfirm: () => void
  onClose: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const element = dialog.current
    const previous = document.activeElement
    element?.showModal()
    return () => {
      element?.close()
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [])
  return (
    <dialog
      ref={dialog}
      className="confirm-dialog"
      aria-labelledby="confirm-title"
      onCancel={(event) => {
        event.preventDefault()
        if (!loading) onClose()
      }}
    >
      <h2 id="confirm-title">{title}</h2>
      <div className="muted">{children}</div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="management-actions">
        <button
          type="button"
          className="button button-secondary"
          disabled={loading}
          onClick={onClose}
          autoFocus
        >
          Cancelar
        </button>
        <button
          type="button"
          className="button"
          disabled={loading}
          onClick={onConfirm}
        >
          {loading && <LoadingSpinner />}
          {loading ? 'Guardando…' : confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
