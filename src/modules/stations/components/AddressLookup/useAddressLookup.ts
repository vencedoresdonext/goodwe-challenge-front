import { useCallback, useMemo, useRef, useState } from 'react'
import { getErrorMessage } from '../../../../lib/http'
import { parseDecimal } from '../../../../shared/utils'
import { stationsApi } from '../../api/stations.api'
import type { GeocodeResult } from '../../types'

export type LookupStatus = 'idle' | 'searching' | 'choosing' | 'confirmed' | 'empty' | 'error'

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface SearchOutcome {
  results: GeocodeResult[]
  selected: GeocodeResult | null
}

const isValidLatitude = (v: number | null): v is number => v != null && v >= -90 && v <= 90
const isValidLongitude = (v: number | null): v is number => v != null && v >= -180 && v <= 180

/**
 * Estado da busca "endereço -> coordenadas".
 * - Um único resultado com número exato é confirmado automaticamente.
 * - Vários resultados (ou só aproximados) exigem que o usuário escolha.
 * - Sem resultado, dá para informar as coordenadas à mão.
 */
export function useAddressLookup() {
  const [status, setStatus] = useState<LookupStatus>('idle')
  const [results, setResults] = useState<GeocodeResult[]>([])
  const [selected, setSelected] = useState<GeocodeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [manual, setManual] = useState(false)
  const [manualLatitude, setManualLatitude] = useState('')
  const [manualLongitude, setManualLongitude] = useState('')
  const requestId = useRef(0)

  const search = useCallback(async (address: string): Promise<SearchOutcome> => {
    const query = address.trim()
    const id = ++requestId.current
    setStatus('searching')
    setError(null)
    setSelected(null)
    try {
      const found = await stationsApi.geocode(query)
      if (id !== requestId.current) return { results: [], selected: null }

      setResults(found)
      if (found.length === 0) {
        setStatus('empty')
        return { results: found, selected: null }
      }
      if (found.length === 1 && found[0].precision === 'address') {
        setSelected(found[0])
        setStatus('confirmed')
        return { results: found, selected: found[0] }
      }
      setStatus('choosing')
      return { results: found, selected: null }
    } catch (err) {
      if (id === requestId.current) {
        setError(getErrorMessage(err))
        setStatus('error')
      }
      return { results: [], selected: null }
    }
  }, [])

  const select = useCallback((result: GeocodeResult) => {
    setSelected(result)
    setStatus('confirmed')
  }, [])

  // Volta para a lista (ou para o início) sem perder os resultados
  const change = useCallback(() => {
    setSelected(null)
    setStatus(results.length > 1 ? 'choosing' : 'idle')
  }, [results.length])

  const reset = useCallback(() => {
    requestId.current += 1
    setStatus('idle')
    setResults([])
    setSelected(null)
    setError(null)
    setManual(false)
    setManualLatitude('')
    setManualLongitude('')
  }, [])

  const manualCoordinates = useMemo(() => {
    const latitude = parseDecimal(manualLatitude)
    const longitude = parseDecimal(manualLongitude)
    return {
      latitude,
      longitude,
      latitudeError: manualLatitude && !isValidLatitude(latitude) ? 'Latitude entre -90 e 90.' : undefined,
      longitudeError: manualLongitude && !isValidLongitude(longitude) ? 'Longitude entre -180 e 180.' : undefined,
    }
  }, [manualLatitude, manualLongitude])

  const location: Coordinates | null = useMemo(() => {
    if (manual) {
      const { latitude, longitude } = manualCoordinates
      return isValidLatitude(latitude) && isValidLongitude(longitude) ? { latitude, longitude } : null
    }
    return selected ? { latitude: selected.latitude, longitude: selected.longitude } : null
  }, [manual, manualCoordinates, selected])

  return {
    status,
    results,
    selected,
    error,
    location,
    manual,
    manualLatitude,
    manualLongitude,
    manualCoordinates,
    search,
    select,
    change,
    reset,
    setManual,
    setManualLatitude,
    setManualLongitude,
  }
}

export type AddressLookup = ReturnType<typeof useAddressLookup>
