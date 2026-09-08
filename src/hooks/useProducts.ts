import { getProducts } from '../services/catalogService'
import { useQuery } from './useQuery'
export function useProducts() {
  const { data, ...state } = useQuery('products', getProducts)
  return { products: data ?? [], ...state }
}
