import type { ReactNode } from 'react'
import type { Tone } from '../../constants/enums'
import { cn } from '../../utils/cn'
import styles from './Badge.module.css'

interface BadgeProps {
  tone?: Tone
  children: ReactNode
  pulse?: boolean
}

export function Badge({ tone = 'neutral', pulse = false, children }: BadgeProps) {
  return (
    <span className={cn(styles.badge, styles[tone])}>
      <span className={cn(styles.dot, pulse && styles.pulse)} aria-hidden />
      {children}
    </span>
  )
}
