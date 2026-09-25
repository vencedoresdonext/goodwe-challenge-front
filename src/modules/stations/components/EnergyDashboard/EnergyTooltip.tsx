import { formatCents, formatKw, formatKwh, formatNumber } from '../../../../shared/utils'
import type { EnergyPeriod } from '../../types'
import { formatRange, type ChartRow, type EnergyMetric } from './energy-chart-utils'
import styles from './EnergyDashboard.module.css'

interface EnergyTooltipProps {
  active?: boolean
  payload?: ReadonlyArray<{ payload?: unknown }>
  period: EnergyPeriod
  metric: EnergyMetric
  series: Array<{ key: string; label: string; color: string }>
  contractedDemandKw: number
}

export function EnergyTooltip({ active, payload, period, metric, series, contractedDemandKw }: EnergyTooltipProps) {
  const row = payload?.[0]?.payload as ChartRow | undefined
  if (!active || !row) return null

  const format = metric === 'power' ? formatKw : formatKwh
  const visible = series.filter((s) => row[s.key] > 0)
  const demandPercent = contractedDemandKw ? (row.peak / contractedDemandKw) * 100 : null

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipTitle}>{formatRange(row.t, row.end, period)}</p>

      {visible.length === 0 ? (
        <p className={styles.tooltipEmpty}>Nenhuma recarga neste intervalo.</p>
      ) : (
        <ul className={styles.tooltipList}>
          {visible.map((s) => (
            <li key={s.key}>
              <span className={styles.dot} style={{ background: s.color }} aria-hidden />
              <span className={styles.tooltipName}>{s.label}</span>
              <span>{format(row[s.key])}</span>
            </li>
          ))}
          {visible.length > 1 && (
            <li className={styles.tooltipTotal}>
              <span />
              <span className={styles.tooltipName}>{metric === 'power' ? 'Média total' : 'Total'}</span>
              <span>{format(row.total)}</span>
            </li>
          )}
        </ul>
      )}

      {row.peak > 0 && (
        <dl className={styles.tooltipFacts}>
          <div>
            <dt>Pico</dt>
            <dd className={demandPercent != null && demandPercent >= 90 ? styles.critical : undefined}>
              {formatKw(row.peak)}
              {demandPercent != null && ` (${formatNumber(Math.round(demandPercent))}% da demanda)`}
            </dd>
          </div>
          <div>
            <dt>Recargas</dt>
            <dd>{row.sessions}</dd>
          </div>
          {row.revenueCents > 0 && (
            <div>
              <dt>Receita</dt>
              <dd>{formatCents(row.revenueCents)}</dd>
            </div>
          )}
        </dl>
      )}
    </div>
  )
}
