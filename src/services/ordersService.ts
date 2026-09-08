
import {orderApi} from '../api/axios'
import type {CreateOrderRequest, CreateOrderResponse, Order, OrderDetail, OrderStatus, UpdateOrderStatusResponse} from '../types/type'

export async function createOrder( payload: CreateOrderRequest): Promise<CreateOrderResponse> {
    if (!payload.user_id || !payload.items.length || payload.items.some(item =>
        !Number.isSafeInteger(item.product_id) || item.product_id <= 0 ||
        !Number.isSafeInteger(item.quantity) || item.quantity <= 0)) {
        throw new Error('El pedido requiere un usuario y productos con cantidades enteras positivas')
    }
    const { data } = await orderApi.post<CreateOrderResponse>('/api/orders',payload)
    return data
}

export async function getMyOrders(userId: string, signal?: AbortSignal): Promise<Order[]> {
    const { data } = await orderApi.get<Order[]>(`/api/orders/user/${encodeURIComponent(userId)}`, { signal })
    return data
}

export async function getOrder(id: number, signal?: AbortSignal): Promise<OrderDetail> {
    const { data } = await orderApi.get<OrderDetail>(`/api/orders/${id}`, { signal })
    return data
}

export async function updateOrderStatus(id: number,status: OrderStatus,): Promise<UpdateOrderStatusResponse> {
    const { data } = await orderApi.patch<UpdateOrderStatusResponse>(`/api/orders/${id}/status`,{ status })
    return data
}