import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Places from './pages/Places/Places'
import Templates from './pages/Templates/Templates'
import UnitDetail from './pages/UnitDetail/UnitDetail'
import Login from './pages/login/Login'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/places" replace />} />
          <Route path="/places" element={<Places />} />
          <Route path="/places/:placeId" element={<UnitDetail />} />
          <Route path="/templates" element={<Templates />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
