import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoreVertical, Plus } from 'lucide-react'
import type { Place } from '../../types'
import style from './style.module.css'
import { getPlaces } from '../../services/domains/places'

export default function Places() {
  const [places, setPlaces] = useState<Place[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    getPlaces().then(setPlaces)
  }, [])

  return (
    <div className={style.page}>
      <div className={style.header}>
        <h1>Places</h1>
        <button
          type="button"
          className={style.addButton}
          aria-label="Adicionar local"
          onClick={() => {
            // TODO: abrir modal/rota de cadastro de novo local
          }}
        >
          <Plus size={24} />
        </button>
      </div>

      <div className={style.grid}>
        {places.map((place) => (
          <button
            key={place.id}
            type="button"
            className={style.card}
            onClick={() => navigate(`/places/${place.id}`)}
          >
            <div className={style.imageWrapper}>
              <img src={place.imageUrl} alt={place.name} />
              <span
                className={style.menuButton}
                role="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation()
                  // TODO: abrir menu de opções do card (editar/excluir)
                }}
              >
                <MoreVertical size={18} />
              </span>
            </div>
            <div className={style.info}>
              <strong>{place.name}</strong>
              <p>{place.address}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
