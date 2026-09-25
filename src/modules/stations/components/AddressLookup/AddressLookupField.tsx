import { Check, ExternalLink, MapPin, MapPinOff, Search } from 'lucide-react'
import { useId, type KeyboardEvent } from 'react'
import { Badge, Button, InlineError, Spinner, TextField } from '../../../../shared/components'
import type { Tone } from '../../../../shared/constants/enums'
import type { GeocodePrecision, GeocodeResult } from '../../types'
import type { AddressLookup } from './useAddressLookup'
import styles from './AddressLookupField.module.css'

const PRECISION_META: Record<GeocodePrecision, { label: string; tone: Tone }> = {
  address: { label: 'Número exato', tone: 'success' },
  street: { label: 'Só a rua', tone: 'warning' },
  area: { label: 'Aproximado', tone: 'neutral' },
}

const MIN_QUERY_LENGTH = 5

const formatCoord = (value: number) => value.toFixed(6)
const mapUrl = (r: { latitude: number; longitude: number }) =>
  `https://www.openstreetmap.org/?mlat=${r.latitude}&mlon=${r.longitude}#map=18/${r.latitude}/${r.longitude}`

interface AddressLookupFieldProps {
  value: string
  onChange: (address: string) => void
  lookup: AddressLookup
  /** Erro de validação vindo do formulário (ex.: endereço vazio / não confirmado) */
  error?: string
  disabled?: boolean
}

export function AddressLookupField({ value, onChange, lookup, error, disabled }: AddressLookupFieldProps) {
  const listName = useId()
  const canSearch = value.trim().length >= MIN_QUERY_LENGTH && lookup.status !== 'searching' && !disabled

  function handleChange(next: string) {
    onChange(next)
    // Endereço mudou depois de confirmado: as coordenadas não valem mais
    if (!lookup.manual && lookup.status !== 'idle' && next !== lookup.selected?.label) lookup.reset()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return
    event.preventDefault() // não envia o formulário
    if (canSearch) void lookup.search(value)
  }

  function choose(result: GeocodeResult) {
    lookup.select(result)
    onChange(result.label)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchRow}>
        <TextField
          label="Endereço"
          placeholder="Rua, número, cidade"
          value={value}
          error={error}
          hint={lookup.status === 'idle' && !lookup.manual ? 'Busque o endereço para localizarmos a station no mapa.' : undefined}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoComplete="street-address"
        />
        {!lookup.manual && (
          <Button
            variant="secondary"
            icon={<Search size={16} />}
            onClick={() => void lookup.search(value)}
            disabled={!canSearch}
            className={styles.searchButton}
          >
            Buscar
          </Button>
        )}
      </div>

      {lookup.status === 'searching' && (
        <div className={styles.status}>
          <Spinner size={16} label="Buscando endereço" /> Buscando endereço…
        </div>
      )}

      {lookup.status === 'choosing' && (
        <fieldset className={styles.choices}>
          <legend className={styles.choicesTitle}>
            {lookup.results.length > 1
              ? `Encontramos ${lookup.results.length} endereços parecidos. Qual é o correto?`
              : 'Encontramos um endereço aproximado. Confirma que é este?'}
          </legend>
          {lookup.results.map((result) => {
            const precision = PRECISION_META[result.precision]
            return (
              <label key={`${result.latitude},${result.longitude},${result.label}`} className={styles.choice}>
                <input type="radio" name={listName} className={styles.radio} onChange={() => choose(result)} />
                <span className={styles.choiceBody}>
                  <span className={styles.choiceLabel}>{result.label}</span>
                  <span className={styles.choiceMeta}>{result.displayName}</span>
                </span>
                <Badge tone={precision.tone}>{precision.label}</Badge>
              </label>
            )
          })}
          <p className={styles.choicesHint}>
            Nenhum desses? Ajuste o endereço (número, bairro, cidade) e busque de novo, ou{' '}
            <button type="button" className={styles.link} onClick={() => lookup.setManual(true)}>
              informe as coordenadas
            </button>
            .
          </p>
        </fieldset>
      )}

      {lookup.status === 'confirmed' && lookup.selected && !lookup.manual && (
        <div className={styles.confirmed}>
          <span className={styles.confirmedIcon} aria-hidden>
            <Check size={16} />
          </span>
          <div className={styles.confirmedBody}>
            <strong>Localização confirmada</strong>
            <span className={styles.coords}>
              {formatCoord(lookup.selected.latitude)}, {formatCoord(lookup.selected.longitude)}
              {lookup.selected.precision !== 'address' && ` · ${PRECISION_META[lookup.selected.precision].label.toLowerCase()}`}
            </span>
          </div>
          <a href={mapUrl(lookup.selected)} target="_blank" rel="noreferrer" className={styles.mapLink}>
            <MapPin size={14} aria-hidden /> Ver no mapa <ExternalLink size={12} aria-hidden />
          </a>
          {lookup.results.length > 1 && (
            <Button variant="ghost" size="sm" onClick={lookup.change}>
              Trocar
            </Button>
          )}
        </div>
      )}

      {(lookup.status === 'empty' || lookup.status === 'error') && !lookup.manual && (
        <div className={styles.notFound}>
          <MapPinOff size={16} aria-hidden />
          <div>
            {lookup.status === 'empty' ? (
              <p>Não encontramos esse endereço. Confira o número, o bairro e a cidade e tente de novo.</p>
            ) : (
              <InlineError message={lookup.error} />
            )}
            <button type="button" className={styles.link} onClick={() => lookup.setManual(true)}>
              Informar latitude e longitude manualmente
            </button>
          </div>
        </div>
      )}

      {lookup.manual && (
        <div className={styles.manual}>
          <div className={styles.manualRow}>
            <TextField
              label="Latitude"
              inputMode="decimal"
              placeholder="-23,5614"
              value={lookup.manualLatitude}
              error={lookup.manualCoordinates.latitudeError}
              onChange={(e) => lookup.setManualLatitude(e.target.value)}
            />
            <TextField
              label="Longitude"
              inputMode="decimal"
              placeholder="-46,6559"
              value={lookup.manualLongitude}
              error={lookup.manualCoordinates.longitudeError}
              onChange={(e) => lookup.setManualLongitude(e.target.value)}
            />
          </div>
          <button type="button" className={styles.link} onClick={lookup.reset}>
            Voltar para a busca por endereço
          </button>
        </div>
      )}
    </div>
  )
}
