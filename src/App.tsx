import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import PrivateRoute from './components/PrivateRoute/PrivateRoute' // TEMP: login/registro desativados, rota privada não é usada por enquanto
import Layout from './components/Layout/Layout'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Places from './pages/Places/Places'
import UnitDetail from './pages/UnitDetail/UnitDetail'
import Templates from './pages/Templates/Templates'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* /login continua sendo a rota principal/inicial do app */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/*
          TEMP: bloqueio de rota privada (PrivateRoute) desativado.
          Antes:
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/places" element={<Places />} />
              <Route path="/units/:id" element={<UnitDetail />} />
              <Route path="/templates" element={<Templates />} />
            </Route>
          </Route>
        */}
        <Route element={<Layout />}>
          <Route path="/places" element={<Places />} />
          <Route path="/units/:id" element={<UnitDetail />} />
          <Route path="/templates" element={<Templates />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
