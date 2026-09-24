import { MoreVertical } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { IconButton } from '../Button/Button'
import styles from './Menu.module.css'

export interface MenuItem {
  label: string
  icon?: ReactNode
  disabled?: boolean
  danger?: boolean
}

interface MenuProps {
  label: string
  items: MenuItem[]
}

export function Menu({ label, items }: MenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={styles.root} ref={rootRef} onClick={(event) => event.stopPropagation()}>
      <IconButton
        label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <MoreVertical size={18} />
      </IconButton>
      {open && (
        <ul id={menuId} role="menu" className={styles.menu}>
          {items.map((item) => (
            <li key={item.label} role="none">
              <button
                type="button"
                role="menuitem"
                className={cn(styles.item, item.danger && styles.danger)}
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false)
                }}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
