import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import styles from './PageHeader.module.css'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  backTo?: { to: string; label: string }
}

export function PageHeader({ title, description, actions, backTo }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.text}>
        {backTo && (
          <Link to={backTo.to} className={styles.back}>
            <ArrowLeft size={16} aria-hidden />
            {backTo.label}
          </Link>
        )}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  )
}
