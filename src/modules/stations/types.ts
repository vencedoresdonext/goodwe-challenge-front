import type { ConnectorStatus } from '../../shared/constants/enums'

export interface Connector {
  id: string
  chargerId: string
  connectorType: string
  maxPowerKw: number
  statusId: ConnectorStatus
}

export interface Station {
  id: string
  name: string
  latitude: number
  longitude: number
  address: string
  pricePerKwh: number
  contractedDemandKw: number
  currentConsumptionKw: number
  currentSolarGenerationKw: number
  isActive: boolean
  distance?: number
  connectors?: Connector[]
}

export interface Charger {
  id: string
  receiverUserId: string
  receiverCardId: string | null
  pricePerKwhCents: number
  createdAt: string
  updatedAt: string
}
