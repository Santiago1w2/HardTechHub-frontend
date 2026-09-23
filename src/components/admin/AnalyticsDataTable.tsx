import { useState } from 'react'
import { Pagination } from '../common/Pagination'
import type { AnalyticsRow } from '../../types/type'

export function AnalyticsDataTable({ rows, total, label }: { rows: AnalyticsRow[]; total: number; label: string }) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const columns = [...new Set(rows.flatMap(row => Object.keys(row)))]
  const currentPage = Math.min(page, Math.max(1, Math.ceil(rows.length / limit)))
  const visibleRows = rows.slice((currentPage - 1) * limit, currentPage * limit)
  return <>
    <p className="muted">{total} registros recibidos</p>
    {!rows.length ? <p className="muted">No hay datos registrados.</p> : <>
      <div className="table-scroll" role="region" aria-label={label} tabIndex={0}>
        <table className="management-table">
          <thead><tr>{columns.map(column => <th key={column}>{column.replaceAll('_', ' ')}</th>)}</tr></thead>
          <tbody>{visibleRows.map((row, index) => <tr key={index}>
            {columns.map(column => <td className="wrap-cell" key={column}>{row[column] ?? '—'}</td>)}
          </tr>)}</tbody>
        </table>
      </div>
      <Pagination page={currentPage} limit={limit} total={rows.length} loading={false}
        onChange={(nextPage, nextLimit) => { setPage(nextPage); setLimit(nextLimit) }} />
    </>}
  </>
}
