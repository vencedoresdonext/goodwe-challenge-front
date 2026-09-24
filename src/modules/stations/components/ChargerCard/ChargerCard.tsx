import { CreditCard, Eye, Play, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { paths } from '../../../../app/router/paths'
import { Badge, Menu, type MenuItem } from '../../../../shared/components'
import { CONNECTOR_STATUS_META, ConnectorStatus, metaOf } from '../../../../shared/constants/enums'
import { formatKw, formatKwh } from '../../../../shared/utils'
import type { ChargingSession } from '../../../charging-sessions'
import type { Connector } from '../../types'
import styles from './ChargerCard.module.css'

interface ChargerCardProps {
  connector: Connector
  label: string
  activeSession?: ChargingSession
  onStartSession: (connector: Connector) => void
}

export function ChargerCard({ connector, label, activeSession }: ChargerCardProps) {
  const status = metaOf(CONNECTOR_STATUS_META, connector.statusId)
  const canStart = connector.statusId === ConnectorStatus.AVAILABLE && !activeSession

  const items: MenuItem[] = [
    {
      label: 'Iniciar recarga',
      icon: <Play size={16} />,
      disabled: !canStart,
    },
    {
      label: 'Cartão de recebimento',
      icon: <CreditCard size={16} />,
    },
  ]

  return (
    <article className={styles.card} data-status={connector.statusId}>
      <header className={styles.header}>
        <div className={styles.icon} aria-hidden>
          <Zap size={20} />
        </div>
        <Menu label={`Ações do ${label}`} items={items} />
      </header>

      <div className={styles.body}>
        <h3 className={styles.name}>{label}</h3>
        <p className={styles.meta}>{connector.connectorType}</p>
      </div>

      <div className={styles.power}>{formatKw(connector.maxPowerKw)}</div>

      <footer className={styles.footer}>
        <Badge tone={status.tone}>{status.label}</Badge>
        {activeSession && (
          <Link to={paths.sessionDetail(activeSession.id)} className={styles.session}>
            <Eye size={14} aria-hidden />
            Em recarga, {formatKwh(activeSession.energyDeliveredKwh)}
          </Link>
        )}
      </footer>
    </article>
  )
}
