import { useCallback } from 'react'
import { createProduct } from '../services/catalogService'
import type { CreateProductRequest } from '../types/type'
import { useMutation } from './useMutation'
import { useProducts } from './useProducts'

export function useCreateProduct() {
  const { refetch } = useProducts()
  const create = useCallback(
    async (payload: CreateProductRequest) => {
      const result = await createProduct(payload)
      refetch()
      return result
    },
    [refetch],
  )
  const { execute, ...state } = useMutation(create)
  return { submitProduct: execute, ...state }
}
