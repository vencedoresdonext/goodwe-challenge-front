import type { EnergyDashboard, EnergyPeriod } from '../../types'

// Azul primeiro = mesma cor de "consumo" do LoadMeter. Vermelho fica reservado
// para o pico / zona crítica, dourado para solar.
export const SERIES_COLORS = ['#3b82f6', '#3ecf8e', '#a78bfa', '#22d3ee', '#f472b6', '#fb923c', '#94a3b8', '#e879f9']
export const colorOf = (index: number) => SERIES_COLORS[index % SERIES_COLORS.length]

export const PERIOD_OPTIONS: Array<{ value: EnergyPeriod; label: string; long: string }> = [
  { value: '24h', label: '24 h', long: 'nas últimas 24 horas' },
  { value: '7d', label: '7 dias', long: 'nos últimos 7 dias' },
  { value: '30d', label: '30 dias', long: 'nos últimos 30 dias' },
]

export type EnergyMetric = 'power' | 'energy'

export const METRIC_OPTIONS: Array<{ value: EnergyMetric; label: string }> = [
  { value: 'power', label: 'Potência (kW)' },
  { value: 'energy', label: 'Energia (kWh)' },
]

/** Faixa de alerta: a partir de 90% da demanda (mesmo limiar do LoadMeter) */
export const CRITICAL_RATIO = 0.9

const hour = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })
const dayMonth = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' })
const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit' })
const dayFull = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
const full = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

export function formatTick(t: number, period: EnergyPeriod) {
  const d = new Date(t)
  if (period === '24h') return hour.format(d)
  if (period === '7d') return weekday.format(d).replace('.', '')
  return dayMonth.format(d)
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

export function formatRange(start: number, end: number, period: EnergyPeriod) {
  if (period === '30d') return capitalize(dayFull.format(new Date(start)))
  return capitalize(`${full.format(new Date(start))} às ${hour.format(new Date(end))}`)
}

/** Arredonda o topo do eixo Y para um valor "redondo" (10, 25, 50, 100, 250...) */
export function niceMax(value: number) {
  if (value <= 0) return 10
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const step = [1, 2, 2.5, 5, 10].find((m) => m * magnitude >= value) ?? 10
  return step * magnitude
}

export const formatMoment = (iso: string) => full.format(new Date(iso))

/** Ticks do eixo X: horas "redondas" em 24h, meia-noite em 7d, a cada 5 dias em 30d */
export function ticksFor(times: number[], period: EnergyPeriod) {
  if (period === '24h') return times.filter((t) => new Date(t).getHours() % 3 === 0)
  if (period === '7d') return times.filter((t) => new Date(t).getHours() === 0)
  return times.filter((_, i) => (times.length - 1 - i) % 5 === 0)
}

export type ChartRow = {
  t: number
  end: number
  peak: number
  total: number
  sessions: number
  revenueCents: number
} & Record<string, number>

export function toChartRows(dashboard: EnergyDashboard, metric: EnergyMetric): ChartRow[] {
  return dashboard.points.map((p) => {
    const row: ChartRow = {
      t: new Date(p.start).getTime(),
      end: new Date(p.end).getTime(),
      peak: p.peakPowerKw,
      total: metric === 'power' ? p.avgPowerKw : p.totalEnergyKwh,
      sessions: p.sessions,
      revenueCents: p.revenueCents,
    } as ChartRow
    for (const s of dashboard.series) {
      const value = p.series[s.key]
      row[s.key] = metric === 'power' ? (value?.avgPowerKw ?? 0) : (value?.energyKwh ?? 0)
    }
    return row
  })
}

/** Participação de cada série na energia do período (para a legenda) */
export function seriesShares(dashboard: EnergyDashboard) {
  const totals = new Map<string, number>()
  for (const p of dashboard.points) {
    for (const s of dashboard.series) {
      totals.set(s.key, (totals.get(s.key) ?? 0) + (p.series[s.key]?.energyKwh ?? 0))
    }
  }
  const sum = dashboard.totals.energyKwh || 1
  return dashboard.series.map((s, index) => ({
    ...s,
    color: colorOf(index),
    energyKwh: totals.get(s.key) ?? 0,
    share: ((totals.get(s.key) ?? 0) / sum) * 100,
  }))
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
