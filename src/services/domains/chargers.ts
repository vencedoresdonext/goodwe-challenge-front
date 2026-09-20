import type { Charger, PlaceStats } from "../../types"
import { api } from "../api"

export const getChargersByPlace = (placeId: string) =>
  api<Charger[]>(`/places/${placeId}/chargers`)

export const getPlaceStats = (placeId: string) =>
  api<PlaceStats>(`/places/${placeId}/stats`)
