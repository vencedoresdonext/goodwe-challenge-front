import type { ReactNode } from 'react'
import { ToastProvider } from '../../shared/components'
import { AuthProvider } from '../../modules/auth'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  )
}
