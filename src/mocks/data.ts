// TEMP: dados mockados usados enquanto as telas estão em andamento /
// enquanto a integração com o back-end não está finalizada (auth, stations,
// chargers, stats). Centralizado aqui para manter Places, UnitDetail e o
// usuário do Sidebar consistentes entre si.
//
// Quando as integrações reais voltarem a ser usadas, este arquivo pode ser
// removido e os imports revertidos para os services em `services/domains`.

import type { Charger, Place, PlaceStats } from '../types'

export const MOCK_USER = {
  name: 'Usuário Teste',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
}

export const MOCK_PLACES: Place[] = [
  {
    id: 'mock-place-1',
    name: 'Estação Central',
    address: 'Av. Paulista, 1000 - São Paulo/SP',
    imageUrl:
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'mock-place-2',
    name: 'Estação Vila Mariana',
    address: 'Rua Domingos de Morais, 500 - São Paulo/SP',
    imageUrl:
      'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'mock-place-3',
    name: 'Estação Alphaville',
    address: 'Alameda Rio Negro, 200 - Barueri/SP',
    imageUrl:
      'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'mock-place-4',
    name: 'Estação Campinas',
    address: 'Av. Norte-Sul, 850 - Campinas/SP',
    imageUrl:
      'https://images.unsplash.com/photo-1647500408906-e19e2a5b3d33?auto=format&fit=crop&w=600&q=80',
  },
]

export const MOCK_STATS_BY_PLACE: Record<string, PlaceStats> = {
  'mock-place-1': { vehicles: 3, availableKw: 42, consumptionKw: 18.5 },
  'mock-place-2': { vehicles: 1, availableKw: 22, consumptionKw: 5.2 },
  'mock-place-3': { vehicles: 5, availableKw: 60, consumptionKw: 33.8 },
  'mock-place-4': { vehicles: 0, availableKw: 30, consumptionKw: 0 },
}

export const MOCK_CHARGERS_BY_PLACE: Record<string, Charger[]> = {
  'mock-place-1': [
    { id: 'mock-charger-1', name: 'Carregador 01', powerKw: 22, status: 'livre' },
    { id: 'mock-charger-2', name: 'Carregador 02', powerKw: 22, status: 'ocupado' },
    { id: 'mock-charger-3', name: 'Carregador 03', powerKw: 11, status: 'desativado' },
    { id: 'mock-charger-4', name: 'Carregador 04', powerKw: 60, status: 'livre' },
  ],
  'mock-place-2': [
    { id: 'mock-charger-5', name: 'Carregador 01', powerKw: 22, status: 'ocupado' },
  ],
  'mock-place-3': [
    { id: 'mock-charger-6', name: 'Carregador 01', powerKw: 60, status: 'livre' },
    { id: 'mock-charger-7', name: 'Carregador 02', powerKw: 60, status: 'livre' },
    { id: 'mock-charger-8', name: 'Carregador 03', powerKw: 22, status: 'ocupado' },
    { id: 'mock-charger-9', name: 'Carregador 04', powerKw: 22, status: 'ocupado' },
    { id: 'mock-charger-10', name: 'Carregador 05', powerKw: 11, status: 'livre' },
  ],
  'mock-place-4': [
    { id: 'mock-charger-11', name: 'Carregador 01', powerKw: 11, status: 'desativado' },
  ],
}

export function getMockPlaceById(id: string | undefined): Place | null {
  if (!id) return MOCK_PLACES[0] ?? null
  return MOCK_PLACES.find((place) => place.id === id) ?? MOCK_PLACES[0] ?? null
}

export function getMockStatsByPlaceId(id: string | undefined): PlaceStats | null {
  if (!id) return null
  return MOCK_STATS_BY_PLACE[id] ?? null
}

export function getMockChargersByPlaceId(id: string | undefined): Charger[] {
  if (!id) return []
  return MOCK_CHARGERS_BY_PLACE[id] ?? []
}
