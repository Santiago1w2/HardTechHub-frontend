import type { ComponentType } from '../types/type'

export const componentOptions: {
  type: ComponentType
  category: string
  label: string
}[] = [
  { type: 'cpu', category: 'CPU', label: 'Procesador' },
  { type: 'motherboard', category: 'Motherboard', label: 'Placa madre' },
  { type: 'ram', category: 'RAM', label: 'Memoria RAM' },
  { type: 'gpu', category: 'GPU', label: 'Tarjeta gráfica' },
  { type: 'psu', category: 'PSU', label: 'Fuente de poder' },
]

export function componentTypeForCategory(
  category: string,
): ComponentType | undefined {
  return componentOptions.find(
    (option) => option.category.toLowerCase() === category.trim().toLowerCase(),
  )?.type
}
