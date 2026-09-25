import { endpoints, http } from '../../../lib/http'
import type { Charger, CreateStationInput, Station } from '../types'

export const stationsApi = {
  list: () => http.get<Station[]>(endpoints.stations.list),
  getById: (stationId: string) => http.get<Station>(endpoints.stations.detail(stationId)),
  create: (input: CreateStationInput) => http.post<Station>(endpoints.stations.list, input),
  linkReceiverCard: (chargerId: string, cardId: string) =>
    http.patch<Charger>(endpoints.stations.linkCard(chargerId), { cardId }),
}
