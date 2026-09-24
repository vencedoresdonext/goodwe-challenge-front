import { useCallback, useEffect, useRef, useState } from 'react'
import { toApiError, type ApiError } from '../../lib/http'

interface State<T> {
  data: T | undefined
  error: ApiError | null
  loading: boolean
}

interface Options {
  // se for false, a requisição não é disparada automaticamente.
  enabled?: boolean
}

export function useRequest<T>(fetcher: () => Promise<T>, deps: unknown[], { enabled = true }: Options = {}) {
  const [state, setState] = useState<State<T>>({ data: undefined, error: null, loading: enabled })
  const requestId = useRef(0)
  const fetcherRef = useRef(fetcher)

  useEffect(() => {
    fetcherRef.current = fetcher
  })

  const run = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    const id = ++requestId.current
    if (!silent) setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await fetcherRef.current()
      if (id === requestId.current) setState({ data, error: null, loading: false })
      return data
    } catch (error) {
      if (id === requestId.current) {
        setState((prev) => ({ ...prev, error: toApiError(error), loading: false }))
      }
      return undefined
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    void run()
    return () => {
      requestId.current += 1
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, run, ...deps])

  const setData = useCallback((updater: T | ((prev: T | undefined) => T)) => {
    setState((prev) => ({
      ...prev,
      data: typeof updater === 'function' ? (updater as (p: T | undefined) => T)(prev.data) : updater,
    }))
  }, [])

  return { ...state, reload: run, setData }
}
