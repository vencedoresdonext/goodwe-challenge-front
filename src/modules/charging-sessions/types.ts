import type { ChargerSessionStatus, PaymentMethod } from '../../shared/constants/enums'

export interface ChargingSession {
  id: string
  userId: string
  vehicleId: string | null
  chargerId: string
  statusId: ChargerSessionStatus
  consumedAmountCents: number
  energyDeliveredKwh: number
  startedAt: string | null
  finishedAt: string | null
  telemetry?: {
    powerKw: number
    batteryPercentage: number
    estimatedTimeLeftMinutes: number | null
  }
}

export interface StartSessionRequest {
  chargerId: string
  vehicleId?: string
  preAuthorizedAmountCents: number
}

export interface StopSessionRequest {
  paymentMethodId: PaymentMethod
}
