import { updateProduct } from '../services/catalogService'
import { useMutation } from './useMutation'
export function useUpdateProduct() {
  const { execute, ...state } = useMutation(updateProduct)
  return { updateProduct: execute, ...state }
}
