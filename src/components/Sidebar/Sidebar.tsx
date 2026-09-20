import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ChevronRight, LineChart, Plug, Settings, CircleHelp, LogOut } from 'lucide-react'
import style from './style.module.css'

const navItems = [
  { to: '/relatorios', label: 'Relatórios', icon: LineChart },
  { to: '/lugares', label: 'Usinas', icon: Plug },
  { to: '/configuracao', label: 'Configuração', icon: Settings },
]

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    // TODO: limpar token/sessão quando a autenticação estiver integrada
    navigate('/login')
  }

  return (
    <aside className={`${style.sidebar} ${expanded ? style.expanded : ''}`}>
      <div className={style.top}>
        <div className={style.profile}>
          <img
            className={style.avatar}
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
            alt="Usuário"
          />
          {expanded && <span className={style.userName}>Usuário Teste</span>}
          <button
            type="button"
            className={style.toggle}
            onClick={() => setExpanded((prev) => !prev)}
            aria-label={expanded ? 'Recolher menu' : 'Expandir menu'}
          >
            <ChevronRight size={14} className={expanded ? style.chevronOpen : ''} />
          </button>
        </div>
        <div className={style.divider} />
      </div>

      <nav className={style.nav}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `${style.navItem} ${isActive ? style.navItemActive : ''}`}
          >
            <Icon size={20} className={style.navIcon} />
            {expanded && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {expanded && (
        <div className={style.bottom}>
          <button type="button" className={style.bottomItem}>
            <CircleHelp size={18} />
            <span>Ajuda</span>
          </button>
          <button type="button" className={`${style.bottomItem} ${style.logout}`} onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      )}
    </aside>
  )
}
