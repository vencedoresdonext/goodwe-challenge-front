import { useEffect, useRef } from 'react'

export function usePolling(callback: () => void, intervalMs: number, enabled: boolean) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    if (!enabled) return
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') callbackRef.current()
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs, enabled])
}
