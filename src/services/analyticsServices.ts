import {analyticsApi} from '../api/axios'

import type {EventCountResponse, TopProductsResponse} from '../types/type'
export async function getEventCount(signal?: AbortSignal): Promise<EventCountResponse> {
    const { data } = await analyticsApi.get<EventCountResponse>(
        '/api/analytics/events/count', { signal })
    return data
}

export async function getTopProducts(signal?: AbortSignal): Promise<TopProductsResponse> {
    const { data } = await analyticsApi.get<TopProductsResponse>(
        '/api/analytics/top-products', { signal })
    return data
}