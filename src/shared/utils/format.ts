const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const decimal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 })
const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const dateOnly = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' })

const EMPTY = '—'

type DateInput = string | number | Date | null | undefined

function toDate(value: DateInput): Date | null {
  if (value == null || value === '') return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export const formatCurrency = (value: number | null | undefined) =>
  value == null ? EMPTY : currency.format(value)

export const formatCents = (cents: number | null | undefined) =>
  cents == null ? EMPTY : currency.format(cents / 100)

export const formatNumber = (value: number | null | undefined) =>
  value == null ? EMPTY : decimal.format(value)

export const formatKw = (value: number | null | undefined) =>
  value == null ? EMPTY : `${decimal.format(value)} kW`

export const formatKwh = (value: number | null | undefined) =>
  value == null ? EMPTY : `${decimal.format(value)} kWh`

export function formatDateTime(value: DateInput) {
  const date = toDate(value)
  return date ? dateTime.format(date) : EMPTY
}

export function formatDate(value: DateInput) {
  const date = toDate(value)
  return date ? dateOnly.format(date) : EMPTY
}

// duracao entre duas datas (fim padrão = agora), ex.: "1 h 05 min".
export function formatDuration(start: DateInput, end?: DateInput) {
  const from = toDate(start)
  if (!from) return EMPTY
  const to = toDate(end) ?? new Date()
  const totalMinutes = Math.max(0, Math.round((to.getTime() - from.getTime()) / 60_000))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes} min`
  return `${hours} h ${String(minutes).padStart(2, '0')} min`
}

// validade do cartão no formato MM/AA
export function formatCardExpiry(value: DateInput) {
  const date = toDate(value)
  if (!date) return EMPTY
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${month}/${String(date.getUTCFullYear()).slice(-2)}`
}

// encurta UUIDs para exibição: "3f2a9c1e…"
export const shortId = (value: string | null | undefined) => (value ? `${value.slice(0, 8)}…` : EMPTY)

export function initials(name: string | null | undefined, fallback = '?') {
  if (!name?.trim()) return fallback
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}
