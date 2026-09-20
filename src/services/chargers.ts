import type { Charger, PlaceStats } from '../types'

// TODO: remover o mock quando o back-end NestJS estiver disponível
const chargersByPlace: Record<string, Charger[]> = {
  paulista: [
    { id: '1', name: 'Carregador 1', powerKw: 22, status: 'livre' },
    { id: '2', name: 'Carregador 2', powerKw: 22, status: 'ocupado' },
    { id: '3', name: 'Carregador 3', powerKw: 22, status: 'desativado' },
    { id: '4', name: 'Carregador 4', powerKw: 22, status: 'livre' },
  ],
  aclimacao: [
    { id: '5', name: 'Carregador 5', powerKw: 22, status: 'livre' },
  ],
}

export async function getChargersByPlace(placeId: string): Promise<Charger[]> {
  // Implementação real:
  // const res = await fetch(`${import.meta.env.VITE_API_URL}/places/${placeId}/chargers`)
  // if (!res.ok) throw new Error('Falha ao buscar carregadores')
  // return res.json()

  return Promise.resolve(chargersByPlace[placeId] ?? [])
}

export async function getPlaceStats(placeId: string): Promise<PlaceStats> {
  const chargers = await getChargersByPlace(placeId)
  const availableKw = chargers
    .filter((charger) => charger.status !== 'desativado')
    .reduce((sum, charger) => sum + charger.powerKw, 0)

  return {
    vehicles: chargers.length,
    availableKw,
    // TODO: substituir por dado real de consumo vindo do EV Charger (OCPP/MODBUS)
    consumptionKw: availableKw,
  }
}
