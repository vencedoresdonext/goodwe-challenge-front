import { Outlet } from 'react-router-dom'
// import { Navigate } from 'react-router-dom'
// import { tokenStorage } from '../../services/api'

// TEMP: verificação de login/token desativada. Rota liberada sem autenticação.
export default function PrivateRoute() {
  // return tokenStorage.access ? <Outlet /> : <Navigate to="/login" replace />
  return <Outlet />
}
