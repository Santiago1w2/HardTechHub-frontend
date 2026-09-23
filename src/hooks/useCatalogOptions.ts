import { getCategories, getBrands } from '../services/catalogService'
import { useQuery } from './useQuery'

async function loadOptions(signal: AbortSignal) {
  const [categories, brands] = await Promise.all([
    getCategories(signal),
    getBrands(signal),
  ])
  return { categories, brands }
}

export function useCatalogOptions() {
  const { data, ...state } = useQuery('catalog-options', loadOptions)
  return {
    categories: data?.categories ?? [],
    brands: data?.brands ?? [],
    ...state,
  }
}
