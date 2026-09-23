import { useCallback } from 'react'
import { updateProduct } from '../services/catalogService'
import type { UpdateProductRequest } from '../types/type'
import { useMutation } from './useMutation'
import { useProducts } from './useProducts'

export function useUpdateProduct() {
  const { refetch } = useProducts()
  const update = useCallback(
    async (id: number, payload: UpdateProductRequest) => {
      const result = await updateProduct(id, payload)
      refetch()
      return result
    },
    [refetch],
  )
  const { execute, ...state } = useMutation(update)
  return { updateProduct: execute, ...state }
}
