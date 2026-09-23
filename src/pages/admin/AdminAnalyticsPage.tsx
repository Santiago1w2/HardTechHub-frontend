import { useState, type ReactNode } from 'react'
import { useAnalytics } from '../../hooks/useAnalytics'
import { useMutation } from '../../hooks/useMutation'
import { refreshAnalytics } from '../../services/analyticsServices'
import { ErrorState, PageSkeleton } from '../../components/common/States'
import { formatPrice } from '../../utils/formatPrice'

function Section({title, query, children}: {title: string; query: {loading: boolean; error: string | null; refetch: () => void}; children: ReactNode}) {
 return <section className="management-card"><h3>{title}</h3>{query.loading ? <PageSkeleton /> : query.error ? <ErrorState message={query.error} retry={query.refetch}/> : children}</section>
}
function Table({headers, rows}: {headers: string[]; rows: ReactNode[][]}) {
 return rows.length ? <div className="table-scroll"><table className="management-table"><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>)}</tbody></table></div> : <p className="muted">No hay datos registrados.</p>
}
export function AdminAnalyticsPage() {
 const a = useAnalytics()
 const refresh = useMutation(refreshAnalytics)
 const [notice, setNotice] = useState('')
 async function update() {
  setNotice('')
  try { const result = await refresh.execute(); setNotice(`Datos actualizados: ${result.records} registros, ${new Date(result.refreshed_at).toLocaleString('es-PE')}.`); a.refetch() } catch { /* Error rendered below. */ }
 }
 return <section><div className="section-heading"><div><h2>Analítica</h2><p>Ventas, pedidos y movimientos del último conjunto de datos publicado.</p></div><div className="management-actions">
 <button className="button button-secondary" onClick={a.refetch} disabled={a.loading || refresh.loading}>Consultar</button>
 <button className="button" onClick={update} disabled={refresh.loading || a.loading}>{refresh.loading ? 'Actualizando datos…' : 'Actualizar datos'}</button></div></div>
 <p className="notice">Actualizar datos importa los registros operacionales. Consultar vuelve a leer las métricas publicadas.</p>
 {refresh.error && <p role="alert" className="form-error">{refresh.error}</p>}{notice && <p role="status" className="success-banner">{notice}</p>}
 <Section title="Resumen" query={a.summary}>{a.summary.data && <dl className="analytics-distribution">{Object.entries({Pedidos:a.summary.data.orders, Ventas:a.summary.data.sales, Ingresos:formatPrice(a.summary.data.revenue), 'Unidades vendidas':a.summary.data.units_sold ?? '—', 'Productos vendidos':a.summary.data.products_sold ?? '—'}).map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}</Section>
 <div className="analytics-grid">
 <Section title="Productos más vendidos" query={a.products}><Table headers={['Producto','Unidades','Ingresos']} rows={(a.products.data?.top_products ?? []).map(p=>[p.product_name, p.units, formatPrice(p.revenue)])}/></Section>
 <Section title="Categorías más vendidas" query={a.categories}><Table headers={['Categoría','Unidades','Ingresos']} rows={(a.categories.data ?? []).map(c=>[c.category,c.units,formatPrice(c.revenue)])}/></Section>
 <Section title="Ventas por día" query={a.trends}><Table headers={['Día','Ventas','Ingresos']} rows={(a.trends.data ?? []).map(t=>[t.day,t.sales,formatPrice(t.revenue)])}/></Section>
 <Section title="Movimientos de inventario" query={a.movements}><Table headers={['Tipo','Movimientos','Unidades']} rows={(a.movements.data ?? []).map(m=>[m.movement_type,m.movements,m.units])}/></Section>
 <Section title="Eventos registrados" query={a.events}>{a.events.data && <><p className="metric-value">{a.events.data.total_events}</p><Table headers={['Tipo','Eventos']} rows={Object.entries(a.events.data.by_type)}/></>}</Section>
 <Section title="Productos más vistos" query={a.views}><Table headers={['Producto (ID)','Vistas']} rows={(a.views.data?.top_products ?? []).map(p=>[p.product_id,p.views])}/></Section>
 </div></section>
}
