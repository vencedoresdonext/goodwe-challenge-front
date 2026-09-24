import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoadingState } from '../../shared/components'
import { AppLayout } from '../layout/AppLayout'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PrivateRoute } from './guards/PrivateRoute'
import { PublicOnlyRoute } from './guards/PublicOnlyRoute'
import { paths } from './paths'

const LoginPage = lazy(() => import('../../modules/auth/pages/LoginPage/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() =>
  import('../../modules/auth/pages/RegisterPage/RegisterPage').then((m) => ({ default: m.RegisterPage })),
)
const StationsPage = lazy(() =>
  import('../../modules/stations/pages/StationsPage/StationsPage').then((m) => ({ default: m.StationsPage })),
)
const StationDetailPage = lazy(() =>
  import('../../modules/stations/pages/StationDetailPage/StationDetailPage').then((m) => ({
    default: m.StationDetailPage,
  })),
)
const SessionsPage = lazy(() =>
  import('../../modules/charging-sessions/pages/SessionsPage/SessionsPage').then((m) => ({ default: m.SessionsPage })),
)
const SessionDetailPage = lazy(() =>
  import('../../modules/charging-sessions/pages/SessionDetailPage/SessionDetailPage').then((m) => ({
    default: m.SessionDetailPage,
  })),
)
const TransactionsPage = lazy(() =>
  import('../../modules/transactions/pages/TransactionsPage/TransactionsPage').then((m) => ({ default: m.TransactionsPage })),
)
const SettingsPage = lazy(() =>
  import('../../modules/users/pages/SettingsPage/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path={paths.login} element={<LoginPage />} />
            <Route path={paths.register} element={<RegisterPage />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path={paths.stations} element={<StationsPage />} />
              <Route path="/stations/:stationId" element={<StationDetailPage />} />
              <Route path={paths.sessions} element={<SessionsPage />} />
              <Route path="/sessoes/:sessionId" element={<SessionDetailPage />} />
              <Route path={paths.transactions} element={<TransactionsPage />} />
              <Route path={paths.settings} element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to={paths.stations} replace />} />
          <Route path="/register" element={<Navigate to={paths.register} replace />} />
          <Route path="/places" element={<Navigate to={paths.stations} replace />} />
          <Route path="/templates" element={<Navigate to={paths.transactions} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
