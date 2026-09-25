import { Activity, RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ErrorState, IconButton, Spinner } from '../../../../shared/components'
import { usePolling, useRequest } from '../../../../shared/hooks'
import { formatCents, formatKw, formatKwh, formatNumber } from '../../../../shared/utils'
import { stationsApi } from '../../api/stations.api'
import type { EnergyPeriod } from '../../types'
import {
  CRITICAL_RATIO,
  METRIC_OPTIONS,
  PERIOD_OPTIONS,
  formatMoment,
  formatTick,
  niceMax,
  prefersReducedMotion,
  seriesShares,
  ticksFor,
  toChartRows,
  type EnergyMetric,
} from './energy-chart-utils'
import { EnergyTooltip } from './EnergyTooltip'
import { SegmentedControl } from './SegmentedControl'
import styles from './EnergyDashboard.module.css'

const REFRESH_INTERVAL_MS = 60_000
const AXIS_COLOR = '#75757d'
const GRID_COLOR = 'rgba(255, 255, 255, 0.06)'
const PEAK_COLOR = '#fc0000'
const DEMAND_COLOR = '#9c9ca3'

interface EnergyDashboardProps {
  /** Com stationId o gráfico é da station, com uma série por carregador */
  stationId?: string
  title?: string
}

export function EnergyDashboard({ stationId, title = 'Energia dos carregadores' }: EnergyDashboardProps) {
  const [period, setPeriod] = useState<EnergyPeriod>('7d')
  const [metric, setMetric] = useState<EnergyMetric>('power')
  const animate = useMemo(() => !prefersReducedMotion(), [])

  const { data, loading, error, reload } = useRequest(
    () => stationsApi.energyDashboard({ period, stationId }),
    [period, stationId],
  )
  usePolling(() => void reload({ silent: true }), REFRESH_INTERVAL_MS, !!data)

  const rows = useMemo(() => (data ? toChartRows(data, metric) : []), [data, metric])
  const shares = useMemo(() => (data ? seriesShares(data) : []), [data])
  const ticks = useMemo(() => ticksFor(rows.map((r) => r.t), period), [rows, period])

  const periodLabel = PERIOD_OPTIONS.find((p) => p.value === period)?.long ?? ''
  const totals = data?.totals
  const demand = totals?.contractedDemandKw ?? 0
  const peakPercent = totals && demand ? (totals.peakPowerKw / demand) * 100 : null
  const isEmpty = !!totals && totals.sessions === 0
  const showDemand = metric === 'power' && demand > 0

  // Topo "redondo" do eixo Y e 5 divisões iguais (0, 50, 100...)
  const yTicks = useMemo(() => {
    const dataMax = rows.reduce((max, r) => Math.max(max, r.total, metric === 'power' ? r.peak : 0), 0)
    const top = niceMax(Math.max(dataMax, showDemand ? demand * 1.05 : 0))
    return Array.from({ length: 6 }, (_, i) => (top / 5) * i)
  }, [rows, metric, showDemand, demand])

  return (
    <section className={styles.panel} aria-labelledby="energy-dashboard-title">
      <header className={styles.header}>
        <div className={styles.heading}>
          <h2 id="energy-dashboard-title" className={styles.title}>
            <Activity size={18} aria-hidden /> {title}
          </h2>
          <p className={styles.subtitle}>
            {metric === 'power'
              ? `Potência média e pico das recargas ${periodLabel}.`
              : `Energia entregue ${periodLabel}.`}
          </p>
        </div>
        <div className={styles.controls}>
          <SegmentedControl label="Métrica" value={metric} options={METRIC_OPTIONS} onChange={setMetric} />
          <SegmentedControl label="Período" value={period} options={PERIOD_OPTIONS} onChange={setPeriod} />
          <IconButton label="Atualizar gráfico" onClick={() => void reload()} disabled={loading}>
            <RefreshCw size={16} className={loading ? styles.spinning : undefined} />
          </IconButton>
        </div>
      </header>

      {error && !data ? (
        <ErrorState message={error.message} onRetry={() => void reload()} />
      ) : (
        <>
          <div className={styles.summary}>
            <div className={styles.peak}>
              <span className={styles.peakLabel}>Pico de potência</span>
              <span className={styles.peakValue}>
                {totals ? formatNumber(totals.peakPowerKw) : '—'}
                <small> kW</small>
              </span>
              {demand > 0 && (
                <div className={styles.headroom}>
                  <div
                    className={styles.headroomTrack}
                    role="meter"
                    aria-label="Pico em relação à demanda contratada"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(Math.min(peakPercent ?? 0, 100))}
                  >
                    <div
                      className={`${styles.headroomFill} ${(peakPercent ?? 0) >= CRITICAL_RATIO * 100 ? styles.headroomCritical : ''}`}
                      style={{ width: `${Math.min(peakPercent ?? 0, 100)}%` }}
                    />
                  </div>
                  <span>
                    {peakPercent != null ? `${formatNumber(Math.round(peakPercent))}%` : '—'} de {formatKw(demand)} contratados
                  </span>
                </div>
              )}
              {totals?.peakAt && <span className={styles.peakWhen}>em {formatMoment(totals.peakAt)}</span>}
            </div>

            <dl className={styles.facts}>
              <div>
                <dt>Energia entregue</dt>
                <dd>{totals ? formatKwh(totals.energyKwh) : '—'}</dd>
              </div>
              <div>
                <dt>Potência média</dt>
                <dd>{totals ? formatKw(totals.avgPowerKw) : '—'}</dd>
              </div>
              <div>
                <dt>Receita estimada</dt>
                <dd>{totals ? formatCents(totals.revenueCents) : '—'}</dd>
              </div>
              <div>
                <dt>Recargas</dt>
                <dd>{totals ? totals.sessions : '—'}</dd>
              </div>
              <div>
                <dt>Potência instalada</dt>
                <dd>{totals ? formatKw(totals.installedKw) : '—'}</dd>
              </div>
            </dl>
          </div>

          <div className={styles.chartKey} aria-hidden>
            <span className={styles.unit}>{metric === 'power' ? 'kW' : 'kWh'}</span>
            {metric === 'power' && (
              <span className={styles.keys}>
                <span>
                  <span className={styles.peakSwatch} /> Pico simultâneo
                </span>
                {showDemand && (
                  <span>
                    <span className={styles.demandSwatch} /> Demanda contratada
                  </span>
                )}
                {showDemand && (
                  <span>
                    <span className={styles.zoneSwatch} /> Acima de 90% da demanda
                  </span>
                )}
              </span>
            )}
          </div>

          <div className={styles.chartArea}>
            {!data && loading ? (
              <div className={styles.chartPlaceholder}>
                <Spinner label="Carregando gráfico" />
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={rows} margin={{ top: 16, right: 12, bottom: 0, left: 0 }}>
                    <defs>
                      {shares.map((s) => (
                        <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={s.color} stopOpacity={0.55} />
                          <stop offset="100%" stopColor={s.color} stopOpacity={0.08} />
                        </linearGradient>
                      ))}
                    </defs>

                    <CartesianGrid stroke={GRID_COLOR} vertical={false} />
                    <XAxis
                      dataKey="t"
                      ticks={ticks}
                      tickFormatter={(t: number) => formatTick(t, period)}
                      stroke={AXIS_COLOR}
                      tickLine={false}
                      axisLine={{ stroke: GRID_COLOR }}
                      fontSize={12}
                      minTickGap={16}
                    />
                    <YAxis
                      stroke={AXIS_COLOR}
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      width={44}
                      ticks={yTicks}
                      tickFormatter={(v: number) => formatNumber(v)}
                      domain={[0, yTicks[yTicks.length - 1]]}
                    />

                    {showDemand && (
                      <ReferenceArea
                        y1={demand * CRITICAL_RATIO}
                        y2={demand}
                        fill={PEAK_COLOR}
                        fillOpacity={0.07}
                        ifOverflow="extendDomain"
                      />
                    )}
                    {showDemand && (
                      <ReferenceLine
                        y={demand}
                        stroke={DEMAND_COLOR}
                        strokeDasharray="6 4"
                        label={{
                          value: `Demanda contratada ${formatKw(demand)}`,
                          position: 'insideTopRight',
                          fill: DEMAND_COLOR,
                          fontSize: 11,
                        }}
                      />
                    )}

                    <Tooltip
                      cursor={{ stroke: 'rgba(255,255,255,0.25)', strokeWidth: 1, fill: 'rgba(255,255,255,0.04)' }}
                      content={(props) => (
                        <EnergyTooltip
                          active={props.active}
                          payload={props.payload}
                          period={period}
                          metric={metric}
                          series={shares}
                          contractedDemandKw={demand}
                        />
                      )}
                    />

                    {metric === 'power'
                      ? shares.map((s) => (
                          <Area
                            key={s.key}
                            dataKey={s.key}
                            name={s.label}
                            stackId="power"
                            type="monotone"
                            stroke={s.color}
                            strokeWidth={1.5}
                            fill={`url(#fill-${s.key})`}
                            isAnimationActive={animate}
                            animationDuration={500}
                          />
                        ))
                      : shares.map((s, i) => (
                          <Bar
                            key={s.key}
                            dataKey={s.key}
                            name={s.label}
                            stackId="energy"
                            fill={s.color}
                            radius={i === shares.length - 1 ? [3, 3, 0, 0] : 0}
                            maxBarSize={28}
                            isAnimationActive={animate}
                            animationDuration={500}
                          />
                        ))}

                    {metric === 'power' && (
                      <Line
                        dataKey="peak"
                        name="Pico"
                        type="monotone"
                        stroke={PEAK_COLOR}
                        strokeWidth={1.5}
                        strokeDasharray="2 3"
                        dot={false}
                        activeDot={{ r: 4, fill: PEAK_COLOR, stroke: 'none' }}
                        isAnimationActive={animate}
                        animationDuration={500}
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>

                {isEmpty && (
                  <div className={styles.emptyOverlay}>
                    <p>Nenhuma recarga {periodLabel}.</p>
                    <span>A curva aparece aqui assim que os carregadores forem usados.</span>
                  </div>
                )}
              </>
            )}
          </div>

          {shares.length > 0 && (
            <ul className={styles.legend} aria-label="Participação na energia do período">
              {shares.map((s) => (
                <li key={s.key} className={styles.legendItem}>
                  <span className={styles.legendName} title={s.label}>
                    <span className={styles.dot} style={{ background: s.color }} aria-hidden />
                    {s.label}
                  </span>
                  <span className={styles.legendValue}>
                    {formatKwh(s.energyKwh)}
                    <small>{totals?.energyKwh ? ` ${formatNumber(Math.round(s.share))}%` : ''}</small>
                  </span>
                  <span className={styles.shareTrack} aria-hidden>
                    <span className={styles.shareFill} style={{ width: `${s.share}%`, background: s.color }} />
                  </span>
                </li>
              ))}
            </ul>
          )}

          <p className={styles.footnote}>
            Potência estimada a partir da energia e da duração de cada recarga.
          </p>
        </>
      )}
    </section>
  )
}
