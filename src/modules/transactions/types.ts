import type { PaymentMethod, TransactionStatus } from '../../shared/constants/enums'

export interface CustomerCard {
  id: string
  lastFourDigits: string
  brand: string
  holderName: string
  expiresAt: string
  isDefault: boolean
}

export interface TokenizeCardRequest {
  cardNumber: string
  holderName: string
  expirationMonth: number
  expirationYear: number
  securityCode: string
  identificationType: 'CPF' | 'CNPJ'
  identificationNumber: string
}

export interface PaymentTransaction {
  id: string
  chargerSessionId?: string | null
  amountCents: number
  statusId: TransactionStatus
  paymentMethodId?: PaymentMethod | null
  createdAt: string
  updatedAt: string
}
