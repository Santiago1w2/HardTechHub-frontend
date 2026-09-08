import { createProduct } from '../services/catalogService'
import { useMutation } from './useMutation'
export function useCreateProduct() {
  const { execute, ...state } = useMutation(createProduct)
  return { submitProduct: execute, ...state }
}

