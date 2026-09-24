import type { ReactNode } from 'react'
import { Logo } from '../../../../shared/components'
import styles from './AuthLayout.module.css'

interface AuthLayoutProps {
  title: string
  children: ReactNode
  footer: ReactNode
}

export function AuthLayout({ title, children, footer }: AuthLayoutProps) {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Logo />
        </div>
        <h1 className={styles.title}>{title}</h1>
        {children}
        <p className={styles.footer}>{footer}</p>
      </div>
    </main>
  )
}
