import { useCallback, useEffect, useRef, useState } from 'react'
import { getApiErrorMessage } from '../api/errors'

export function useMutation<Args extends unknown[], Result>(action: (...args: Args) => Promise<Result>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const busy = useRef(false)
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])
  const execute = useCallback(async (...args: Args): Promise<Result> => {
    if (busy.current) throw new Error('Ya hay una operación en curso')
    busy.current = true
    setLoading(true)
    setError(null)
    try {
      return await action(...args)
    } catch (failure) {
      if (mounted.current) setError(getApiErrorMessage(failure))
      throw failure
    } finally {
      busy.current = false
      if (mounted.current) setLoading(false)
    }
  }, [action])
  return { execute, loading, error }
}
