import type { ConnectorStatus } from '../../shared/constants/enums'

export interface Connector {
  id: string
  chargerId: string
  connectorType: string
  maxPowerKw: number
  statusId: ConnectorStatus
  /** Preço por kWh cobrado por este carregador (R$) */
  pricePerKwh?: number
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

export interface ChargerInput {
  connectorType: string
  maxPowerKw: number
  /** Opcional: sem preço, o carregador herda o preço da station */
  pricePerKwh?: number
}

export interface UpdateChargerInput {
  connectorType?: string
  maxPowerKw?: number
  pricePerKwh?: number
  statusId?: ConnectorStatus
}

export interface CreateStationInput {
  name: string
  address: string
  latitude: number
  longitude: number
  pricePerKwh: number
  contractedDemandKw: number
  chargers: ChargerInput[]
}

export interface Charger {
  id: string
  receiverUserId: string
  receiverCardId: string | null
  pricePerKwhCents: number
  createdAt: string
  updatedAt: string
}

export type GeocodePrecision = 'address' | 'street' | 'area'

export interface GeocodeResult {
  label: string
  displayName: string
  latitude: number
  longitude: number
  precision: GeocodePrecision
  city?: string
  state?: string
  postcode?: string
}

// Dashboard de energia

export type EnergyPeriod = '24h' | '7d' | '30d'

export interface EnergySeries {
  key: string
  label: string
  installedKw: number
  contractedDemandKw?: number
}

export interface EnergyPoint {
  start: string
  end: string
  series: Record<string, { energyKwh: number; avgPowerKw: number }>
  totalEnergyKwh: number
  avgPowerKw: number
  peakPowerKw: number
  revenueCents: number
  sessions: number
}

export interface EnergyDashboard {
  period: EnergyPeriod
  groupBy: 'station' | 'charger'
  from: string
  to: string
  bucketMinutes: number
  series: EnergySeries[]
  points: EnergyPoint[]
  totals: {
    energyKwh: number
    revenueCents: number
    sessions: number
    avgPowerKw: number
    peakPowerKw: number
    peakAt: string | null
    contractedDemandKw: number
    installedKw: number
  }
}
