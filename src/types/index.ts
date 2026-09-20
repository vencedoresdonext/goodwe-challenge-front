export type ChargerStatus = 'livre' | 'ocupado' | 'desativado'

export interface Place {
  id: string
  name: string
  address: string
  imageUrl: string
}

export interface Charger {
  id: string
  name: string
  powerKw: number
  status: ChargerStatus
}

export interface PlaceStats {
  vehicles: number
  availableKw: number
  consumptionKw: number
}

export interface Report {
  id: string
  name: string
  description: string
  lastRecharge: string
}
