import * as analytics from '../services/analyticsServices'
import { useQuery } from './useQuery'

export type AnalyticsSection = 'ventas' | 'catalogo' | 'actividad'

export function useAnalytics(section: AnalyticsSection = 'ventas') {
  const summary = useQuery('analytics-summary', analytics.getSummary)
  const products = useQuery('analytics-products', analytics.getTopProducts, section === 'ventas')
  const categories = useQuery('analytics-categories', analytics.getTopCategories, section === 'ventas')
  const trends = useQuery('analytics-trends', analytics.getTrends, section === 'ventas')
  const movements = useQuery('analytics-movements', analytics.getInventoryMovements, section === 'actividad')
  const events = useQuery('analytics-events', analytics.getEventCount, section === 'actividad')
  const views = useQuery('analytics-views', analytics.getTopViews, section === 'actividad')
  const productCatalog = useQuery('analytics-product-catalog', analytics.getProductCatalogAnalytics, section === 'catalogo')
  const categoryBrands = useQuery('analytics-category-brands', analytics.getCategoryBrandSummary, section === 'catalogo')
  const sections = [summary, products, categories, trends, movements, events, views, productCatalog, categoryBrands]
  return {
    summary, products, categories, trends, movements, events, views, productCatalog, categoryBrands,
    loading: sections.some(query => query.loading),
    refetch: () => sections.forEach(query => query.refetch()),
  }
}
