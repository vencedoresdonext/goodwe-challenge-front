import { endpoints, http } from '../../../lib/http'
import type {
  Charger,
  ChargerInput,
  Connector,
  CreateStationInput,
  EnergyDashboard,
  EnergyPeriod,
  GeocodeResult,
  Station,
  UpdateChargerInput,
} from '../types'

export const stationsApi = {
  list: () => http.get<Station[]>(endpoints.stations.list),
  getById: (stationId: string) => http.get<Station>(endpoints.stations.detail(stationId)),
  create: (input: CreateStationInput) => http.post<Station>(endpoints.stations.list, input),
  linkReceiverCard: (chargerId: string, cardId: string) =>
    http.patch<Charger>(endpoints.stations.linkCard(chargerId), { cardId }),

  // Endereço -> coordenadas (pode voltar mais de um resultado parecido)
  geocode: (address: string) =>
    http.get<GeocodeResult[]>(endpoints.stations.geocode, { params: { address }, timeout: 20_000 }),

  createCharger: (stationId: string, input: ChargerInput) =>
    http.post<Connector>(endpoints.stations.chargers(stationId), input),
  updateCharger: (chargerId: string, input: UpdateChargerInput) =>
    http.patch<Connector>(endpoints.stations.charger(chargerId), input),

  energyDashboard: (params: { period: EnergyPeriod; stationId?: string }) =>
    http.get<EnergyDashboard>(endpoints.stations.energyDashboard, {
      params: { ...params, tzOffset: new Date().getTimezoneOffset() },
    }),
}
