import { analyticsApi } from '../api/axios'
import type { AnalyticsSummary, TopProductsResponse, EventCountResponse, AnalyticsCategory, AnalyticsTrend, AnalyticsMovement, TopViewsResponse, AnalyticsRefresh } from '../types/type'

export async function getSummary(signal?: AbortSignal): Promise<AnalyticsSummary> {
  return (await analyticsApi.get<AnalyticsSummary>('/api/analytics/summary', { signal })).data
}
export async function getEventCount(signal?: AbortSignal): Promise<EventCountResponse> {
  return (await analyticsApi.get<EventCountResponse>('/api/analytics/events/count', { signal })).data
}
export async function getTopProducts(signal?: AbortSignal): Promise<TopProductsResponse> {
  return (await analyticsApi.get<TopProductsResponse>('/api/analytics/top-products', { signal })).data
}
export async function getTopCategories(signal?: AbortSignal): Promise<AnalyticsCategory[]> {
  return (await analyticsApi.get<{ categories: AnalyticsCategory[] }>('/api/analytics/top-categories', { signal })).data.categories
}
export async function getTrends(signal?: AbortSignal): Promise<AnalyticsTrend[]> {
  return (await analyticsApi.get<{ trends: AnalyticsTrend[] }>('/api/analytics/trends', { signal })).data.trends
}
export async function getInventoryMovements(signal?: AbortSignal): Promise<AnalyticsMovement[]> {
  return (await analyticsApi.get<{ movements: AnalyticsMovement[] }>('/api/analytics/inventory-movements', { signal })).data.movements
}
export async function getTopViews(signal?: AbortSignal): Promise<TopViewsResponse> {
  return (await analyticsApi.get<TopViewsResponse>('/api/analytics/top-views', { signal })).data
}
export async function refreshAnalytics(): Promise<AnalyticsRefresh> {
  return (await analyticsApi.post<AnalyticsRefresh>('/api/analytics/refresh', undefined, { timeout: 120_000 })).data
}
