export interface AuthRequest {
    email: string
    password: string
}

export interface RegisterResponse {
    message: string
    user_id: string
}

export interface LoginResponse {
    access_token: string
    token_type: string
}

export interface UserProfile {
    user_id: string
    email: string
    roles: string[]
    preferences: Record<string, unknown>
    created_at: string | null
}

export interface Product {
    id: number
    sku: string
    name: string
    description: string | null
    price: string
    specs: Record<string, unknown>
    image_url: string | null
    category: string
    brand: string
}

export interface ProductDetail extends Product {
    is_active: boolean
    created_at: string
}

export type OrderStatus = | 'PENDING'| 'PAID' | 'SHIPPED' | 'CANCELLED'

export type Money = string | number

export interface OrderItemRequest {
    product_id: number
    quantity: number
}

export interface CreateOrderRequest {
    user_id: string
    items: OrderItemRequest[]
}

export interface CreateOrderResponse {
    order_id: number
    status: OrderStatus
    total_amount: string
}

export interface Order {
    id: number
    user_id: string
    status: OrderStatus
    subtotal: Money
    tax: Money
    shipping_cost: Money
    total_amount: Money
    created_at: string
    updated_at: string
}

export interface OrderItem {
    id: number
    order_id: number
    product_id: number
    product_sku: string
    product_name: string
    quantity: number
    unit_price: Money
    subtotal: Money
}

export interface OrderDetail {
    order: Order
    items: OrderItem[]
}

export interface UpdateOrderStatusResponse {
    order_id: number
    status: OrderStatus
}

export interface EventCountResponse {
    total_events: number
    by_type: Record<string, number>
    prefix: string
}

export interface TopProductsResponse {
    top_products: Array<{
        product_id: string
        views: number
    }>
}
export interface CreateProductRequest {
  category_id: number
  brand_id: number
  sku: string
  name: string
  price: number
  description?: string
  specs: Record<string, unknown>
  image_url?: string
}
export interface CreateProductResponse {
  id: number
  sku: string
  name: string
  price: string
}
// PUT replaces all these fields; do not send a partial object.
export interface UpdateProductRequest {
  name: string
  description: string
  price: number
  specs: Record<string, unknown>
  image_url: string
  is_active: boolean
}
export interface CartItem { product: Product; quantity: number }
