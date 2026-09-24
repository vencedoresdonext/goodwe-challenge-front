import { formatKw } from '../../../../shared/utils'
import type { Station } from '../../types'
import { getStationMetrics } from '../../utils'
import styles from './LoadMeter.module.css'

interface LoadMeterProps {
  station: Station
  size?: 'sm' | 'lg'
}

export function LoadMeter({ station, size = 'sm' }: LoadMeterProps) {
  const { loadPercent, solarPercent } = getStationMetrics(station)
  const solarWithinLoad = Math.min(solarPercent, loadPercent)
  const level = loadPercent >= 90 ? styles.critical : ''

  return (
    <div className={`${styles.meter} ${styles[size]}`}>
      <div
        className={styles.track}
        role="meter"
        aria-label="Consumo em relação à demanda contratada"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(loadPercent)}
      >
        <div className={`${styles.load} ${level}`} style={{ width: `${loadPercent}%` }} />
        <div className={styles.solar} style={{ width: `${solarWithinLoad}%` }} />
      </div>
      <div className={styles.legend}>
        <span>
          <strong>{formatKw(station.currentConsumptionKw)}</strong> de {formatKw(station.contractedDemandKw)}
        </span>
        <span className={styles.solarLabel}>{formatKw(station.currentSolarGenerationKw)} solar</span>
      </div>
    </div>
  )
}
