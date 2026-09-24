const DEFAULT_API_URL = 'http://localhost:3000/api'

function toNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const apiUrl = (import.meta.env.VITE_API_URL ?? DEFAULT_API_URL).replace(/\/+$/, '')

if (!import.meta.env.VITE_API_URL && import.meta.env.DEV) {
  console.warn(`[env] VITE_API_URL não definida. Usando ${DEFAULT_API_URL}.`)
}

export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? 'GoodWe ChargeGrid',
  appEnv: import.meta.env.VITE_APP_ENV ?? 'development',
  apiUrl,
  apiTimeout: toNumber(import.meta.env.VITE_API_TIMEOUT, 10_000),
  sessionPollInterval: toNumber(import.meta.env.VITE_SESSION_POLL_INTERVAL, 5_000),
} as const
