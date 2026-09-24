import { BatteryCharging, ChevronRight, LogOut, Plug, Receipt, Settings } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../modules/auth'
import { cn, initials } from '../../shared/utils'
import { paths } from '../router/paths'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { to: paths.stations, label: 'Stations', icon: Plug },
  { to: paths.sessions, label: 'Sessões', icon: BatteryCharging },
  { to: paths.transactions, label: 'Transações', icon: Receipt },
  { to: paths.settings, label: 'Configuração', icon: Settings },
]

export function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const displayName = user?.fullName || user?.email || 'Usuário'

  function handleLogout() {
    logout()
    navigate(paths.login, { replace: true })
  }

  return (
    <aside className={cn(styles.sidebar, expanded && styles.expanded)}>
      <div className={styles.profile}>
        <span className={styles.avatar} aria-hidden>
          {initials(user?.fullName || user?.email)}
        </span>
        {expanded && (
          <div className={styles.identity}>
            <span className={styles.name}>{displayName}</span>
            {user?.fullName && <span className={styles.email}>{user.email}</span>}
          </div>
        )}
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setExpanded((prev) => !prev)}
          aria-label={expanded ? 'Recolher menu' : 'Expandir menu'}
          aria-expanded={expanded}
        >
          <ChevronRight size={14} className={cn(styles.chevron, expanded && styles.chevronOpen)} />
        </button>
      </div>

      <nav className={styles.nav} aria-label="Navegação principal">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={expanded ? undefined : label}
            className={({ isActive }) => cn(styles.navItem, isActive && styles.navItemActive)}
          >
            <Icon size={20} className={styles.navIcon} aria-hidden />
            <span className={cn(styles.navLabel, !expanded && 'visually-hidden')}>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.bottom}>
        <button type="button" className={styles.logout} onClick={handleLogout} title="Sair">
          <LogOut size={18} aria-hidden />
          <span className={cn(!expanded && 'visually-hidden')}>Sair</span>
        </button>
      </div>
    </aside>
  )
}
