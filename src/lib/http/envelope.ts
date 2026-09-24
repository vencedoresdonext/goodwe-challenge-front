const ENVELOPE_KEYS = new Set(['data', 'message'])

function isEnvelope(value: unknown): value is { data: unknown; message?: unknown } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const keys = Object.keys(value)
  return keys.includes('data') && keys.every((key) => ENVELOPE_KEYS.has(key))
}

export function unwrapEnvelope<T>(body: unknown): T {
  let current = body
  while (isEnvelope(current)) {
    current = current.data
  }
  return current as T
}
