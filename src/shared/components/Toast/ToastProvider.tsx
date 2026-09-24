import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { Check, CircleAlert, Info, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { ToastContext, type ToastApi, type ToastKind } from './toast-context'
import styles from './Toast.module.css'

interface ToastItem {
  id: number
  message: string
  kind: ToastKind
}

const ICONS = { success: Check, error: CircleAlert, info: Info }
const DURATION_MS = 4500

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback(
    (message: string, kind: ToastKind = 'info') => {
      const id = ++nextId.current
      setToasts((prev) => [...prev.slice(-3), { id, message, kind }])
      window.setTimeout(() => dismiss(id), DURATION_MS)
    },
    [dismiss],
  )

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (message) => show(message, 'success'),
      error: (message) => show(message, 'error'),
    }),
    [show],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={styles.viewport} aria-live="polite">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.kind]
          return (
            <div key={toast.id} className={cn(styles.toast, styles[toast.kind])} role="status">
              <Icon size={18} aria-hidden />
              <p>{toast.message}</p>
              <button type="button" aria-label="Dispensar" onClick={() => dismiss(toast.id)}>
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
