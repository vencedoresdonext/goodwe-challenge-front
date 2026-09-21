import { Navigate, Outlet } from 'react-router-dom'
import { tokenStorage } from '../../services/api'

export default function PrivateRoute() {
  return tokenStorage.access ? <Outlet /> : <Navigate to="/login" replace />
}
