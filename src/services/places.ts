import type { Place } from '../types'

// TODO: remover o mock quando o back-end NestJS estiver disponível
const mockPlaces: Place[] = [
  {
    id: 'paulista',
    name: 'Unidade - Paulista',
    address: 'Av. Paulista, 1106 - Bela Vista, São Paulo',
    imageUrl:
      'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'aclimacao',
    name: 'Unidade - Aclimação',
    address: 'Av. Lins de Vasconcelos, 1222 - Aclimação, São Paulo',
    imageUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
  },
]

export async function getPlaces(): Promise<Place[]> {
  // Implementação real (quando a API estiver pronta):
  // const res = await fetch(`${import.meta.env.VITE_API_URL}/places`)
  // if (!res.ok) throw new Error('Falha ao buscar locais')
  // return res.json()

  return Promise.resolve(mockPlaces)
}

export async function getPlaceById(id: string): Promise<Place | null> {
  const places = await getPlaces()
  return places.find((place) => place.id === id) ?? null
}
