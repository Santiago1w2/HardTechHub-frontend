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

export type OrderStatus = 'RESERVING' | 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED'

export type Money = string | number

export interface OrderItemRequest {
  product_id: number
  quantity: number
}

export interface CreateOrderRequest {
  items: OrderItemRequest[]
}

export interface CreateOrderResponse {
  order_id: number
  status: OrderStatus
  total_amount: string
}

export interface Order {
  id: number
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
}

export interface TopProductsResponse {
  top_products: Array<{
    product_id: number
    product_name: string
    units: number | string
    revenue: string
  }>
}
export interface CreateProductRequest {
  category_id: number
  brand_id: number
  sku: string
  name: string
  price: number
  description?: string
  specs?: Record<string, unknown>
  image_url?: string
}
export interface CreateProductResponse {
  id: number
  sku: string
  name: string
  price: string
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  specs?: Record<string, unknown>
  image_url?: string
  is_active?: boolean
}
export interface CartItem {
  product: Product
  quantity: number
}

export type ComponentType = 'cpu' | 'motherboard' | 'ram' | 'gpu' | 'psu'

export interface ComponenteRequestCompatibility {
  type: ComponentType
  product_id: number
}

export interface CompatibilityResponse {
  compatible: boolean
  messages: Array<string>
}

export interface CompatibilityRequest {
  components: Array<ComponenteRequestCompatibility>
}

export interface CatalogOption {
  id: number
  name: string
}

export interface PaginatedResponse<T> {
  items: T[]
  page: number
  limit: number
  total: number
}

export type ProductStatusFilter = 'all' | 'active' | 'inactive'

export interface AdminProductFilters {
  page: number
  limit: number
  status?: ProductStatusFilter
  q?: string
}

export interface AdminOrderFilters {
  page: number
  limit: number
  status?: OrderStatus
  order_id?: number
  date_from?: string
  date_to?: string
}

export interface InventoryItem { product_id: number; stock: number; reserved_stock: number; available_stock: number; reorder_point: number; updated_at: string | null }
export interface AnalyticsSummary { orders: number; sales: number; revenue: string; units_sold?: number | string; products_sold?: number }
export interface AnalyticsCategory { category: string; units: number | string; revenue: string }
export interface AnalyticsTrend { day: string; sales: number; revenue: string }
export interface AnalyticsMovement { movement_type: string; movements: number; units: number | string }
export interface TopViewsResponse { top_products: { product_id: number | string; views: number }[] }
export interface AnalyticsRefresh { records: number; key: string; refreshed_at: string }

export interface UpdateInventoryRequest {
  stock: number
  reorder_point: number
}
export interface CreateInventoryRequest extends UpdateInventoryRequest {
  product_id: number
}

// Athena query() emits integer numbers, text/decimal strings and null cells.
// The two SELECT * views have no fixed column definition in this repository.
export type AnalyticsRow = Record<string, string | number | null>
export interface AnalyticsProductCatalog {
  products: AnalyticsRow[]
  total: number
}
export interface AnalyticsCategoryBrandSummary {
  summary: AnalyticsRow[]
  total: number
}
