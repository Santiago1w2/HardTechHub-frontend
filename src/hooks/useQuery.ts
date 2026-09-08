import { useCallback, useEffect, useState } from 'react'
import { getApiErrorMessage } from '../api/errors'

// Callers memoize load with useCallback. Old requests are aborted and ignored.
export function useQuery<T>(key: string, load: (signal: AbortSignal) => Promise<T>, enabled = true) {
  const [revision, setRevision] = useState(0)
  const [state, setState] = useState<{ key: string; revision: number; data?: T; error: string | null }>({ key: '', revision: -1, error: null })
  const refetch = useCallback(() => setRevision(value => value + 1), [])
  useEffect(() => {
    if (!enabled) return
    const controller = new AbortController()
    load(controller.signal).then(data => {
      if (!controller.signal.aborted) setState({ key, revision, data, error: null })
    }).catch((failure: unknown) => {
      if (!controller.signal.aborted) setState({ key, revision, error: getApiErrorMessage(failure) })
    })
    return () => controller.abort()
  }, [key, load, enabled, revision])
  const current = enabled && state.key === key && state.revision === revision
  return {
    data: current ? state.data : undefined,
    loading: enabled && !current,
    error: current ? state.error : null,
    refetch,
  }
}
