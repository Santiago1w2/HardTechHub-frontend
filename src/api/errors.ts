import axios from 'axios'

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail: unknown = error.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) {
      return detail.map((item: unknown) =>
        typeof item === 'object' && item !== null && 'msg' in item
          ? String(item.msg) : 'Datos inválidos',
      ).join(', ')
    }
    if (typeof error.response?.data?.message === 'string') return error.response.data.message
    return error.response ? `Error HTTP ${error.response.status}` : 'No se pudo conectar con el servidor'
  }
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado'
}
