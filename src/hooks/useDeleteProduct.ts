import { deleteProduct } from '../services/catalogService'
import { useMutation } from './useMutation'
export function useDeleteProduct() {
  const { execute, ...state } = useMutation(deleteProduct)
  return { deleteProduct: execute, ...state }
}
