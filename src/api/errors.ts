import axios from 'axios'

const messages: Record<string, string> = {
  'Invalid category or brand':
    'La categoría o marca indicada no existe. Revisa sus identificadores.',
  'Product already exists': 'Ya existe un producto con ese SKU.',
  'Product not found': 'No encontramos ese producto.',
  'Product is inactive':
    'Uno de los productos ya no está disponible. Revisa tu carrito.',
  'Order not found': 'No encontramos ese pedido.',
  'Components are required': 'Selecciona los componentes que deseas comprobar.',
  'Invalid component': 'Revisa los componentes seleccionados.',
  'Unknown or duplicate component type':
    'Selecciona un solo producto por tipo de componente.',
  'Inactive product or missing specifications':
    'Un componente está inactivo o no tiene especificaciones suficientes.',
  'Invalid request': 'Revisa los datos del formulario.',
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0
    if (!error.response)
      return 'No pudimos conectar con el servicio. Comprueba tu conexión e inténtalo nuevamente.'
    const detail: unknown = error.response?.data?.detail
    const message = typeof detail === 'object' && detail !== null && 'message' in detail ? detail.message : detail
    if (message === 'Insufficient stock') return 'No hay stock suficiente para este pedido.'
    if (message === 'Reservation pending; retry this order') return 'La reserva está pendiente. Consulta el pedido para reintentar la reserva.'
    if (typeof detail === 'string' && messages[detail]) return messages[detail]
    if (status === 401)
      return 'El servicio rechazó la solicitud.'
    if (status === 403)
      return 'El servicio no permite esta operación.'
    if (status === 404)
      return 'La información solicitada ya no está disponible.'
    if (status === 409) return 'Ya existe un registro con esos datos.'
    if (status >= 500)
      return 'El servicio no está disponible en este momento. Inténtalo de nuevo en unos minutos.'
    if (Array.isArray(detail)) {
      return detail
        .map((item: unknown) => {
          if (typeof item !== 'object' || item === null || !('msg' in item))
            return 'Revisa los datos ingresados.'
          const message = String(item.msg)
          // Preserve localized validation messages without exposing framework internals.
          return /[áéíóúñ¿]/i.test(message)
            ? message
            : 'Revisa los datos ingresados y sus límites.'
        })
        .join(' ')
    }
    if (status === 400 || status === 422)
      return 'No se pudo completar la solicitud. Revisa los datos o las especificaciones de los componentes.'
    return 'No pudimos completar esta acción. Inténtalo nuevamente.'
  }
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
}

export function getErrorOrderId(error: unknown): number | null {
 if (!axios.isAxiosError(error)) return null
 const detail: unknown = error.response?.data?.detail
 if (typeof detail !== 'object' || detail === null || !('order_id' in detail)) return null
 return typeof detail.order_id === 'number' && Number.isSafeInteger(detail.order_id) ? detail.order_id : null
}
