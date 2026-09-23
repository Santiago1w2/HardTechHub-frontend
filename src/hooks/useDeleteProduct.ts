import { useCallback } from 'react'
import { deleteProduct } from '../services/catalogService'
import { useMutation } from './useMutation'
import { useProducts } from './useProducts'

export function useDeleteProduct() {
  const { refetch } = useProducts()
  const deactivate = useCallback(
    async (id: number) => {
      const result = await deleteProduct(id)
      refetch()
      return result
    },
    [refetch],
  )
  const { execute, ...state } = useMutation(deactivate)
  return { deleteProduct: execute, ...state }
}
