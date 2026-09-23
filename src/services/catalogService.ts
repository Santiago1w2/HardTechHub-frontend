import type {
  CatalogOption,
  PaginatedResponse,
  AdminProductFilters,
} from '../types/type'
import { catalogApi } from '../api/axios'
import type {
  Product,
  ProductDetail,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
} from '../types/type'

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  return (await catalogApi.get<Product[]>('/api/products', { signal })).data
}
export async function getProduct(
  id: number,
  signal?: AbortSignal,
): Promise<ProductDetail> {
  return (
    await catalogApi.get<ProductDetail>(`/api/products/${id}`, { signal })
  ).data
}
export async function createProduct(
  payload: CreateProductRequest,
): Promise<CreateProductResponse> {
  return (
    await catalogApi.post<CreateProductResponse>('/api/products', payload)
  ).data
}
export async function updateProduct(
  id: number,
  payload: UpdateProductRequest,
): Promise<{ updated: boolean }> {
  return (
    await catalogApi.put<{ updated: boolean }>(`/api/products/${id}`, payload)
  ).data
}
export async function deleteProduct(id: number): Promise<{ deleted: boolean }> {
  return (await catalogApi.delete<{ deleted: boolean }>(`/api/products/${id}`))
    .data
}

export async function getCategories(
  signal?: AbortSignal,
): Promise<CatalogOption[]> {
  return (await catalogApi.get<CatalogOption[]>('/api/categories', { signal }))
    .data
}

export async function getBrands(
  signal?: AbortSignal,
): Promise<CatalogOption[]> {
  return (await catalogApi.get<CatalogOption[]>('/api/brands', { signal })).data
}

export async function getAdminProducts(
  filters: AdminProductFilters,
  signal?: AbortSignal,
): Promise<PaginatedResponse<ProductDetail>> {
  return (
    await catalogApi.get<PaginatedResponse<ProductDetail>>(
      '/api/admin/products',
      { params: filters, signal },
    )
  ).data
}
