import { inventoryApi } from '../api/axios'
import axios from 'axios'
import type { InventoryItem } from '../types/type'
export async function getInventory(productId: number, signal?: AbortSignal): Promise<InventoryItem | null> {
  try {
    return (await inventoryApi.get<InventoryItem>(`/inventory/${productId}`, { signal })).data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}
