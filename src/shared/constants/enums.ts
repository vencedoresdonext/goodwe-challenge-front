export type Tone = 'success' | 'info' | 'warning' | 'danger' | 'neutral'

interface EnumMeta {
  label: string
  tone: Tone
}

export const ConnectorStatus = {
  AVAILABLE: 1,
  OCCUPIED: 2,
  OFFLINE: 3,
  FAULTED: 4,
} as const
export type ConnectorStatus = (typeof ConnectorStatus)[keyof typeof ConnectorStatus]

export const CONNECTOR_STATUS_META: Record<ConnectorStatus, EnumMeta> = {
  [ConnectorStatus.AVAILABLE]: { label: 'Livre', tone: 'success' },
  [ConnectorStatus.OCCUPIED]: { label: 'Ocupado', tone: 'warning' },
  [ConnectorStatus.OFFLINE]: { label: 'Offline', tone: 'neutral' },
  [ConnectorStatus.FAULTED]: { label: 'Com falha', tone: 'danger' },
}

export const ChargerSessionStatus = {
  AWAITING_PAYMENT: 1,
  AUTHORIZED: 2,
  CHARGING: 3,
  COMPLETED: 4,
  FAILED: 5,
  CANCELLED: 6,
} as const
export type ChargerSessionStatus = (typeof ChargerSessionStatus)[keyof typeof ChargerSessionStatus]

export const SESSION_STATUS_META: Record<ChargerSessionStatus, EnumMeta> = {
  [ChargerSessionStatus.AWAITING_PAYMENT]: { label: 'Aguardando pagamento', tone: 'warning' },
  [ChargerSessionStatus.AUTHORIZED]: { label: 'Autorizada', tone: 'info' },
  [ChargerSessionStatus.CHARGING]: { label: 'Carregando', tone: 'info' },
  [ChargerSessionStatus.COMPLETED]: { label: 'Concluída', tone: 'success' },
  [ChargerSessionStatus.FAILED]: { label: 'Falhou', tone: 'danger' },
  [ChargerSessionStatus.CANCELLED]: { label: 'Cancelada', tone: 'neutral' },
}

export const TransactionStatus = {
  PENDING: 1,
  AUTHORIZED: 2,
  CAPTURED: 3,
  FAILED: 4,
  REFUNDED: 5,
  EXPIRED: 6,
} as const
export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus]

export const TRANSACTION_STATUS_META: Record<TransactionStatus, EnumMeta> = {
  [TransactionStatus.PENDING]: { label: 'Pendente', tone: 'warning' },
  [TransactionStatus.AUTHORIZED]: { label: 'Autorizada', tone: 'info' },
  [TransactionStatus.CAPTURED]: { label: 'Paga', tone: 'success' },
  [TransactionStatus.FAILED]: { label: 'Falhou', tone: 'danger' },
  [TransactionStatus.REFUNDED]: { label: 'Estornada', tone: 'neutral' },
  [TransactionStatus.EXPIRED]: { label: 'Expirada', tone: 'neutral' },
}

export const PaymentMethod = {
  CREDIT_CARD: 1,
  PIX: 2,
} as const
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  [PaymentMethod.CREDIT_CARD]: 'Cartão de crédito',
  [PaymentMethod.PIX]: 'PIX',
}

const UNKNOWN: EnumMeta = { label: 'Desconhecido', tone: 'neutral' }

// o back pode devolver um ID que o front não reconhece
export function metaOf<K extends number>(table: Record<K, EnumMeta>, key: number | null | undefined): EnumMeta {
  return key != null && key in table ? table[key as K] : UNKNOWN
}
