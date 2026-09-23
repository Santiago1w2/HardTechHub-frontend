export function readPagination(params: URLSearchParams) {
  const requestedPage = Number(params.get('page') ?? 1)
  const requestedLimit = Number(params.get('limit') ?? 20)
  return {
    page:
      Number.isSafeInteger(requestedPage) &&
      requestedPage >= 1 &&
      requestedPage <= 1000000
        ? requestedPage
        : 1,
    limit: [10, 20, 50, 100].includes(requestedLimit) ? requestedLimit : 20,
  }
}

export function paginationParams(
  current: URLSearchParams,
  page: number,
  limit: number,
) {
  const next = new URLSearchParams(current)
  next.set('page', String(page))
  next.set('limit', String(limit))
  return next
}

export function filterParams(values: Record<string, string>, limit: number) {
  const next = new URLSearchParams({ page: '1', limit: String(limit) })
  for (const [key, value] of Object.entries(values)) {
    if (value.trim()) next.set(key, value.trim())
  }
  return next
}
