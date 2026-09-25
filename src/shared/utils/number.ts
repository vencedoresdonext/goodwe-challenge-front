// Aceita "1234", "12,3" ou "12.3" e devolve um número ou null se inválido.
export function parseDecimal(value: string): number | null {
  const normalized = value.replace(',', '.').trim()
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

// Número -> texto editável no padrão brasileiro ("0,89")
export const toDecimalInput = (value: number | null | undefined) =>
  value == null ? '' : String(value).replace('.', ',')
