import { Outlet } from 'react-router-dom'
import style from './style.module.css'
import Sidebar from '../Sidebar/Sidebar'

export default function Layout() {
  return (
    <div className={style.layout}>
      <Sidebar />
      <main className={style.content}>
        <Outlet />
      </main>
    </div>
  )
}
