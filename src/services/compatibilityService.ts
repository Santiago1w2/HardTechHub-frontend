import { compatibilityApi } from '../api/axios'
import type { CompatibilityRequest, CompatibilityResponse } from '../types/type'

export async function postCompatibility(
  payload: CompatibilityRequest,
): Promise<CompatibilityResponse> {
  const types = new Set<string>()
  for (const component of payload.components) {
    if (
      !['cpu', 'motherboard', 'ram', 'gpu', 'psu'].includes(component.type) ||
      types.has(component.type) ||
      !Number.isSafeInteger(component.product_id) ||
      component.product_id <= 0
    ) {
      throw new Error(
        'Selecciona un producto válido por cada tipo de componente.',
      )
    }
    types.add(component.type)
  }
  if (!types.size) throw new Error('Selecciona al menos un componente.')
  return (
    await compatibilityApi.post<CompatibilityResponse>(
      '/api/compatibility/check',
      payload,
    )
  ).data
}
