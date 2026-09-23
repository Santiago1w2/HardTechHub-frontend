export function Pagination({
  page,
  limit,
  total,
  loading,
  onChange,
}: {
  page: number
  limit: number
  total: number
  loading: boolean
  onChange: (page: number, limit: number) => void
}) {
  const pages = Math.max(1, Math.ceil(total / limit))
  return (
    <nav className="management-pagination" aria-label="Paginación">
      <p role="status">
        {loading
          ? 'Cargando…'
          : `${total} resultados · Página ${page} de ${pages}`}
      </p>
      <label>
        Por página
        <select
          value={limit}
          disabled={loading}
          onChange={(event) => onChange(1, Number(event.target.value))}
        >
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
      <div className="management-actions">
        {page > 1 && (
          <button
            className="text-button"
            disabled={loading}
            onClick={() => onChange(1, limit)}
          >
            Primera página
          </button>
        )}
        <button
          className="button button-secondary"
          disabled={loading || page <= 1}
          onClick={() => onChange(page - 1, limit)}
        >
          Anterior
        </button>
        <button
          className="button button-secondary"
          disabled={loading || page >= pages}
          onClick={() => onChange(page + 1, limit)}
        >
          Siguiente
        </button>
      </div>
    </nav>
  )
}
