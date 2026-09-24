import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../../modules/auth'
import { LoadingState } from '../../../shared/components'
import { paths } from '../paths'

export function PublicOnlyRoute() {
  const { status } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  if (status === 'loading') return <LoadingState label="Restaurando sua sessão…" />
  if (status === 'authenticated') return <Navigate to={from ?? paths.stations} replace />
  return <Outlet />
}
