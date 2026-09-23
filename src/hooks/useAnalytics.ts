import * as analytics from '../services/analyticsServices'
import { useQuery } from './useQuery'
export function useAnalytics() {
  const summary = useQuery('analytics-summary', analytics.getSummary)
  const products = useQuery('analytics-products', analytics.getTopProducts)
  const categories = useQuery('analytics-categories', analytics.getTopCategories)
  const trends = useQuery('analytics-trends', analytics.getTrends)
  const movements = useQuery('analytics-movements', analytics.getInventoryMovements)
  const events = useQuery('analytics-events', analytics.getEventCount)
  const views = useQuery('analytics-views', analytics.getTopViews)
  const sections = [summary, products, categories, trends, movements, events, views]
  return { summary, products, categories, trends, movements, events, views,
    loading: sections.some(section => section.loading),
    refetch: () => sections.forEach(section => section.refetch()) }
}
