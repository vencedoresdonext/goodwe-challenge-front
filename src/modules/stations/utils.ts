import { ConnectorStatus } from '../../shared/constants/enums'
import type { Station } from './types'

export interface StationMetrics {
  availableKw: number
  loadPercent: number
  solarPercent: number
  totalConnectors: number
  freeConnectors: number
  installedKw: number
}

const clamp = (value: number) => Math.min(100, Math.max(0, value))

export function getStationMetrics(station: Station): StationMetrics {
  const connectors = station.connectors ?? []
  const demand = station.contractedDemandKw || 0
  return {
    availableKw: Math.max(0, demand - station.currentConsumptionKw),
    loadPercent: demand ? clamp((station.currentConsumptionKw / demand) * 100) : 0,
    solarPercent: demand ? clamp((station.currentSolarGenerationKw / demand) * 100) : 0,
    totalConnectors: connectors.length,
    freeConnectors: connectors.filter((c) => c.statusId === ConnectorStatus.AVAILABLE).length,
    installedKw: connectors.reduce((sum, c) => sum + (c.maxPowerKw || 0), 0),
  }
}
