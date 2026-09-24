import type { ReactNode } from 'react'
import { CircleAlert, LoaderCircle } from 'lucide-react'
import { Button } from '../Button/Button'
import styles from './Feedback.module.css'

export function Spinner({ size = 20, label = 'Carregando' }: { size?: number; label?: string }) {
  return (
    <span role="status" className={styles.spinnerWrap}>
      <LoaderCircle size={size} className={styles.spin} aria-hidden />
      <span className="visually-hidden">{label}</span>
    </span>
  )
}

export function LoadingState({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div className={styles.state}>
      <Spinner size={28} label={label} />
      <p className={styles.muted}>{label}</p>
    </div>
  )
}

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: ReactNode
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.state}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.muted}>{description}</p>}
      {action}
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.state} role="alert">
      <div className={styles.iconDanger}>
        <CircleAlert size={28} />
      </div>
      <p>{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  )
}

export function InlineError({ message }: { message?: string | null }) {
  if (!message) return null
  return (
    <p className={styles.inlineError} role="alert">
      {message}
    </p>
  )
}
