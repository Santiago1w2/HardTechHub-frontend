import type { PaginatedResponse, AdminOrderFilters } from '../types/type'
import { orderApi } from '../api/axios'
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  Order,
  OrderDetail,
  OrderStatus,
  UpdateOrderStatusResponse,
} from '../types/type'

export async function createOrder(
  payload: CreateOrderRequest,
  requestKey: string,
): Promise<CreateOrderResponse> {
  if (
    payload.items.length > 100 ||
    !payload.items.length ||
    payload.items.some(
      (item) =>
        !Number.isSafeInteger(item.product_id) ||
        item.product_id <= 0 ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity <= 0 || item.quantity > 2147483647,
    )
  ) {
    throw new Error(
      'El pedido requiere productos con cantidades enteras positivas',
    )
  }
  const { data } = await orderApi.post<CreateOrderResponse>(
    '/api/orders',
    payload,
    { headers: { 'Idempotency-Key': requestKey } },
  )
  return data
}


export async function getOrder(
  id: number,
  signal?: AbortSignal,
): Promise<OrderDetail> {
  const { data } = await orderApi.get<OrderDetail>(`/api/orders/${id}`, {
    signal,
  })
  return data
}

export async function updateOrderStatus(
  id: number,
  status: OrderStatus,
): Promise<UpdateOrderStatusResponse> {
  const { data } = await orderApi.patch<UpdateOrderStatusResponse>(
    `/api/orders/${id}/status`,
    { status },
  )
  return data
}
export async function getAllOrders(signal?: AbortSignal): Promise<Order[]> {
  return (await orderApi.get<Order[]>('/api/orders', { signal })).data
}

export async function getAdminOrders(
  filters: AdminOrderFilters,
  signal?: AbortSignal,
): Promise<PaginatedResponse<Order>> {
  return (
    await orderApi.get<PaginatedResponse<Order>>('/api/admin/orders', {
      params: filters,
      signal,
    })
  ).data
}

export async function retryOrder(id: number): Promise<CreateOrderResponse> { return (await orderApi.post<CreateOrderResponse>(`/api/orders/${id}/retry`)).data }
