import type { Place } from "../../types"
import { api } from "../api"


export const getPlaces = () => api<Place[]>('/stations/web')
export const getPlaceById = (id: string) => api<Place>(`/stations/web/${id}`)
