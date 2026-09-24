import { endpoints, http } from '../../../lib/http'
import type { Charger, Station } from '../types'

export const stationsApi = {
  list: () => http.get<Station[]>(endpoints.stations.list),
  getById: (stationId: string) => http.get<Station>(endpoints.stations.detail(stationId)),
  linkReceiverCard: (chargerId: string, cardId: string) =>
    http.patch<Charger>(endpoints.stations.linkCard(chargerId), { cardId }),
}
