import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../../modules/auth'
import { LoadingState } from '../../../shared/components'
import { paths } from '../paths'

export function PrivateRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <LoadingState label="Restaurando sua sessão…" />
  if (status === 'unauthenticated') {
    return <Navigate to={paths.login} replace state={{ from: location.pathname + location.search }} />
  }
  return <Outlet />
}
