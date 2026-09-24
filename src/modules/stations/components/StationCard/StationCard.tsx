import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { paths } from '../../../../app/router/paths'
import { Badge } from '../../../../shared/components'
import { formatCurrency } from '../../../../shared/utils'
import type { Station } from '../../types'
import { getStationMetrics } from '../../utils'
import { LoadMeter } from '../LoadMeter/LoadMeter'
import styles from './StationCard.module.css'

export function StationCard({ station }: { station: Station }) {
  const { freeConnectors, totalConnectors } = getStationMetrics(station)

  return (
    <Link to={paths.stationDetail(station.id)} className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.name}>{station.name}</h2>
        {!station.isActive && <Badge tone="neutral">Inativa</Badge>}
      </header>

      <p className={styles.address}>
        <MapPin size={14} aria-hidden />
        {station.address}
      </p>

      <LoadMeter station={station} />

      <footer className={styles.footer}>
        <span>
          <strong>{freeConnectors}</strong> de {totalConnectors} {totalConnectors === 1 ? 'carregador livre' : 'carregadores livres'}
        </span>
        <span>{formatCurrency(station.pricePerKwh)}/kWh</span>
      </footer>
    </Link>
  )
}
