import { MoreVertical } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  getMockChargersByPlaceId,
  getMockPlaceById,
  getMockStatsByPlaceId,
} from '../../mocks/data'
// import { useEffect } from 'react'
// import { getChargersByPlace, getPlaceStats } from '../../services/domains/chargers'
// import { getPlaceById } from '../../services/domains/places'
import type { Charger, ChargerStatus, Place, PlaceStats } from '../../types'
import style from './style.module.css'

const statusLabel: Record<ChargerStatus, string> = {
  livre: 'Livre',
  ocupado: 'Ocupado',
  desativado: 'Desativado',
}

export default function UnitDetail() {
  const { placeId } = useParams<{ placeId: string }>()

  // TEMP: tela ainda em andamento. Usando dados mockados (por placeId) até a
  // integração com os endpoints reais (chargers/stats) ser finalizada.
  const [place] = useState<Place | null>(getMockPlaceById(placeId))
  const [chargers] = useState<Charger[]>(getMockChargersByPlaceId(placeId))
  const [stats] = useState<PlaceStats | null>(getMockStatsByPlaceId(placeId))
  const [selectedId, setSelectedId] = useState<string | null>(null)

  /* Lógica original (restaurar quando a tela/integração estiver pronta):
  const [place, setPlace] = useState<Place | null>(null)
  const [chargers, setChargers] = useState<Charger[]>([])
  const [stats, setStats] = useState<PlaceStats | null>(null)

  useEffect(() => {
    if (!placeId) return
    getPlaceById(placeId).then(setPlace)
    getChargersByPlace(placeId).then(setChargers)
    getPlaceStats(placeId).then(setStats)
  }, [placeId])
  */

  return (
    <div className={style.page}>
      <div className={style.header}>
        <h1>{place ? place.name : 'Unidade'}</h1>

        <div className={style.stats}>
          <div className={style.stat}>
            <span className={style.statLabel}>Veículos</span>
            <span className={style.statValue}>{stats?.vehicles ?? '-'}</span>
          </div>
          <div className={style.stat}>
            <span className={style.statLabel}>Disponível</span>
            <span className={style.statValue}>{stats ? `${stats.availableKw} kW` : '-'}</span>
          </div>
          <div className={style.stat}>
            <span className={style.statLabel}>Consumo</span>
            <span className={style.statValue}>{stats ? `${stats.consumptionKw} kW` : '-'}</span>
          </div>
        </div>
      </div>

      <div className={style.grid}>
        {chargers.map((charger) => (
          <div
            key={charger.id}
            className={`${style.card} ${selectedId === charger.id ? style.cardSelected : ''}`}
            onClick={() => setSelectedId(charger.id)}
          >
            <div className={style.cardTop}>
              <span
                className={style.menuButton}
                onClick={(e) => {
                  e.stopPropagation()
                  // TODO: abrir menu de opções do carregador
                }}
              >
                <MoreVertical size={16} />
              </span>
              <img
                className={style.chargerImage}
                src="https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?auto=format&fit=crop&w=300&q=80"
                alt="Carregador"
              />
            </div>

            <div className={style.cardInfo}>
              <span>{charger.name}</span>
              <strong>{charger.powerKw}KW</strong>
            </div>

            <span className={`${style.badge} ${style[charger.status]}`}>
              {statusLabel[charger.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
