import type { Place } from "../../types"
import { api } from "../api"

export const getPlaces = async () => {
  const res = await api<{ data: Place[] }>('/stations/web')
  return res.data
}

export const getPlaceById = (id: string) => api<Place>(`/stations/web/${id}`)
