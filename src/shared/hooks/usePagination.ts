import { useCallback, useState } from 'react'

export function usePagination(pageSize = 10) {
  const [page, setPage] = useState(0)
  return {
    page,
    take: pageSize,
    skip: page * pageSize,
    next: useCallback(() => setPage((p) => p + 1), []),
    previous: useCallback(() => setPage((p) => Math.max(0, p - 1)), []),
    reset: useCallback(() => setPage(0), []),
  }
}
