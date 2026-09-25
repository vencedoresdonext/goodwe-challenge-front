import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { IconButton } from '../Button/Button'
import styles from './Modal.module.css'

interface ModalProps {
  open: boolean
  title: string
  description?: ReactNode
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?: 'md' | 'lg'
}

export function Modal({ open, title, description, onClose, children, footer, size = 'md' }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className={`${styles.dialog} ${size === 'lg' ? styles.lg : ''}`}
      aria-labelledby="modal-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
    >
      {open && (
        <div className={styles.panel}>
          <header className={styles.header}>
            <div>
              <h2 id="modal-title" className={styles.title}>
                {title}
              </h2>
              {description && <p className={styles.description}>{description}</p>}
            </div>
            <IconButton label="Fechar" onClick={onClose}>
              <X size={18} />
            </IconButton>
          </header>
          <div className={styles.body}>{children}</div>
          {footer && <footer className={styles.footer}>{footer}</footer>}
        </div>
      )}
    </dialog>
  )
}
