import { getEventCount, getTopProducts } from '../services/analyticsServices'
import { useQuery } from './useQuery'
async function loadAnalytics(signal: AbortSignal) {
  const [eventCount, topProducts] = await Promise.all([getEventCount(signal), getTopProducts(signal)])
  return { eventCount, topProducts: topProducts.top_products }
}
export function useAnalytics() {
  const { data, ...state } = useQuery('analytics', loadAnalytics)
  return { eventCount: data?.eventCount ?? null, topProducts: data?.topProducts ?? [], ...state }
}
