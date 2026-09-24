import { Button } from '../Button/Button'
import styles from './Pagination.module.css'

interface PaginationProps {
  page: number
  pageSize: number
  itemCount: number
  loading?: boolean
  onPrevious: () => void
  onNext: () => void
}

export function Pagination({ page, pageSize, itemCount, loading, onPrevious, onNext }: PaginationProps) {
  const hasPrevious = page > 0
  const hasNext = itemCount >= pageSize
  if (!hasPrevious && !hasNext) return null

  const from = page * pageSize + 1
  const to = page * pageSize + itemCount

  return (
    <nav className={styles.pagination} aria-label="Paginação">
      <span className={styles.range}>{itemCount > 0 ? `Exibindo ${from}–${to}` : 'Nenhum registro nesta página'}</span>
      <div className={styles.buttons}>
        <Button variant="secondary" size="sm" onClick={onPrevious} disabled={!hasPrevious || loading}>
          Anterior
        </Button>
        <Button variant="secondary" size="sm" onClick={onNext} disabled={!hasNext || loading}>
          Próxima
        </Button>
      </div>
    </nav>
  )
}
