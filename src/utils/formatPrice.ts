import type { Money } from '../types/type'
export function formatPrice(value: Money): string {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(Number(value))
}
