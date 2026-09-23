import { useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAnalytics, type AnalyticsSection } from '../../hooks/useAnalytics'
import { useMutation } from '../../hooks/useMutation'
import { refreshAnalytics } from '../../services/analyticsServices'
import { ErrorState, PageSkeleton } from '../../components/common/States'
import { AnalyticsDataTable } from '../../components/admin/AnalyticsDataTable'
import { formatPrice } from '../../utils/formatPrice'

function Section({ title, query, children }: {
  title: string
  query: { loading: boolean; error: string | null; refetch: () => void }
  children: ReactNode
}) {
  return <section className="management-card">
    <h3>{title}</h3>
    {query.loading ? <PageSkeleton /> : query.error ?
      <ErrorState message={query.error} retry={query.refetch} /> : children}
  </section>
}

function Table({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return rows.length ? <div className="table-scroll" tabIndex={0}>
    <table className="management-table">
      <thead><tr>{headers.map(header => <th key={header}>{header}</th>)}</tr></thead>
      <tbody>{rows.map((row, index) => <tr key={index}>
        {row.map((cell, column) => <td key={column}>{cell}</td>)}
      </tr>)}</tbody>
    </table>
  </div> : <p className="muted">No hay datos registrados.</p>
}

const sections: { value: AnalyticsSection; label: string }[] = [
  { value: 'ventas', label: 'Ventas y tendencias' },
  { value: 'catalogo', label: 'Catálogo, categorías y marcas' },
  { value: 'actividad', label: 'Inventario y actividad' },
]

export function AdminAnalyticsPage() {
  const [params] = useSearchParams()
  const selected = sections.find(section => section.value === params.get('section'))?.value ?? 'ventas'
  const analytics = useAnalytics(selected)
  const refresh = useMutation(refreshAnalytics)
  const [notice, setNotice] = useState('')
  async function update() {
    setNotice('')
    try {
      const result = await refresh.execute()
      setNotice(`Datos actualizados: ${result.records} registros, ${new Date(result.refreshed_at).toLocaleString('es-PE')}.`)
      analytics.refetch()
    } catch {
      // useMutation presents the error below.
    }
  }
  return <section>
    <div className="section-heading">
      <div><h2>Analítica</h2><p>Datos publicados de ventas, catálogo e inventario.</p></div>
      <div className="management-actions">
        <button className="button button-secondary" onClick={analytics.refetch}
          disabled={analytics.loading || refresh.loading}>Consultar</button>
        <button className="button" onClick={update} disabled={refresh.loading || analytics.loading}>
          {refresh.loading ? 'Actualizando datos…' : 'Actualizar datos'}
        </button>
      </div>
    </div>
    <p className="notice">Actualizar datos importa los registros operacionales. Consultar vuelve a leer las métricas publicadas.</p>
    {refresh.error && <p role="alert" className="form-error">{refresh.error}</p>}
    {notice && <p role="status" className="success-banner">{notice}</p>}
    <nav className="admin-nav" aria-label="Secciones de analítica">
      {sections.map(section => {
        const search = new URLSearchParams(params)
        search.set('section', section.value)
        return <Link key={section.value} to={`?${search}`}
          className={selected === section.value ? 'active' : undefined}
          aria-current={selected === section.value ? 'page' : undefined}>{section.label}</Link>
      })}
    </nav>
    <div className="management-form">
      <Section title="Resumen general" query={analytics.summary}>
        {analytics.summary.data && <dl className="analytics-distribution">
          {Object.entries({
            Pedidos: analytics.summary.data.orders,
            Ventas: analytics.summary.data.sales,
            Ingresos: formatPrice(analytics.summary.data.revenue),
            'Unidades vendidas': analytics.summary.data.units_sold ?? '—',
            'Productos vendidos': analytics.summary.data.products_sold ?? '—',
          }).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>}
      </Section>
      {selected === 'ventas' && <div className="analytics-grid">
        <Section title="Ventas por día" query={analytics.trends}>
          <Table headers={['Día', 'Ventas', 'Ingresos']} rows={(analytics.trends.data ?? []).map(row =>
            [row.day, row.sales, formatPrice(row.revenue)])} />
        </Section>
        <Section title="Productos más vendidos" query={analytics.products}>
          <Table headers={['Producto', 'Unidades', 'Ingresos']} rows={(analytics.products.data?.top_products ?? []).map(row =>
            [row.product_name, row.units, formatPrice(row.revenue)])} />
        </Section>
        <Section title="Categorías más vendidas" query={analytics.categories}>
          <Table headers={['Categoría', 'Unidades', 'Ingresos']} rows={(analytics.categories.data ?? []).map(row =>
            [row.category, row.units, formatPrice(row.revenue)])} />
        </Section>
      </div>}
      {selected === 'catalogo' && <>
        <Section title="Resumen de categorías y marcas" query={analytics.categoryBrands}>
          {analytics.categoryBrands.data && <AnalyticsDataTable rows={analytics.categoryBrands.data.summary}
            total={analytics.categoryBrands.data.total} label="Resumen de categorías y marcas" />}
        </Section>
        <Section title="Catálogo analítico" query={analytics.productCatalog}>
          {analytics.productCatalog.data && <AnalyticsDataTable rows={analytics.productCatalog.data.products}
            total={analytics.productCatalog.data.total} label="Catálogo analítico" />}
        </Section>
      </>}
      {selected === 'actividad' && <div className="analytics-grid">
        <Section title="Movimientos de inventario" query={analytics.movements}>
          <Table headers={['Tipo', 'Movimientos', 'Unidades']} rows={(analytics.movements.data ?? []).map(row =>
            [row.movement_type, row.movements, row.units])} />
        </Section>
        <Section title="Eventos registrados" query={analytics.events}>
          {analytics.events.data && <>
            <p className="metric-value">{analytics.events.data.total_events}</p>
            <Table headers={['Tipo', 'Eventos']} rows={Object.entries(analytics.events.data.by_type)} />
          </>}
        </Section>
        <Section title="Productos más vistos" query={analytics.views}>
          <Table headers={['Producto (ID)', 'Vistas']} rows={(analytics.views.data?.top_products ?? []).map(row =>
            [row.product_id, row.views])} />
        </Section>
      </div>}
    </div>
  </section>
}
