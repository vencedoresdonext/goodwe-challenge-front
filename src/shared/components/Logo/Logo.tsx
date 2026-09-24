import logo from '../../../assets/logo-goodwe.png'
import styles from './Logo.module.css'

export function Logo({ className }: { className?: string }) {
  return <img src={logo} alt="GoodWe" className={`${styles.logo} ${className ?? ''}`} />
}
