import { inventoryApi } from '../api/axios'
import axios from 'axios'
import type { InventoryItem, CreateInventoryRequest, UpdateInventoryRequest } from '../types/type'

export async function getInventory(productId: number, signal?: AbortSignal): Promise<InventoryItem | null> {
  try {
    return (await inventoryApi.get<InventoryItem>(`/inventory/${productId}`, { signal })).data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}

export async function getInventoryList(limit: number, offset: number, signal?: AbortSignal): Promise<InventoryItem[]> {
  return (await inventoryApi.get<InventoryItem[]>('/inventory', { params: { limit, offset }, signal })).data
}

function validateStock(payload: UpdateInventoryRequest) {
  for (const value of [payload.stock, payload.reorder_point]) {
    if (!Number.isInteger(value) || value < 0 || value > 2147483647) {
      throw new Error('Stock y punto de reposición deben ser enteros entre 0 y 2147483647.')
    }
  }
}

function validateProductId(productId: number) {
  if (!Number.isSafeInteger(productId) || productId <= 0) {
    throw new Error('El ID del producto debe ser un entero positivo válido.')
  }
}

export async function createInventory(payload: CreateInventoryRequest): Promise<InventoryItem> {
  validateProductId(payload.product_id)
  validateStock(payload)
  const { product_id, stock, reorder_point } = payload
  return (await inventoryApi.post<InventoryItem>('/inventory', { product_id, stock, reorder_point })).data
}

export async function updateInventory(productId: number, payload: UpdateInventoryRequest): Promise<InventoryItem> {
  validateProductId(productId)
  validateStock(payload)
  const { stock, reorder_point } = payload
  return (await inventoryApi.put<InventoryItem>(`/inventory/${productId}`, { stock, reorder_point })).data
}
