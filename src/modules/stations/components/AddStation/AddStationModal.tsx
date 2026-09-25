import { useState, type FormEvent } from 'react'
import { getErrorMessage } from '../../../../lib/http'
import { Button, InlineError, Modal, TextField } from '../../../../shared/components'
import { stationsApi } from '../../api/stations.api'
import type { CreateStationInput, Station } from '../../types'
import styles from './StationForm.module.css'

interface AddStationModalProps {
  open: boolean
  onClose: () => void
  onCreated: (station: Station) => void
}

interface FormState {
  name: string
  address: string
  latitude: string
  longitude: string
  pricePerKwh: string
  contractedDemandKw: string
}

const EMPTY_FORM: FormState = {
  name: '',
  address: '',
  latitude: '',
  longitude: '',
  pricePerKwh: '',
  contractedDemandKw: '',
}

type FieldErrors = Partial<Record<keyof FormState, string>>

// Aceita "1234", "12,3" ou "12.3" e devolve um número ou null se inválido.
function toNumber(value: string): number | null {
  const normalized = value.replace(',', '.').trim()
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

export function AddStationModal({ open, onClose, onCreated }: AddStationModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function close() {
    if (loading) return
    setForm(EMPTY_FORM)
    setFieldErrors({})
    setError(null)
    onClose()
  }

  function validate(): CreateStationInput | null {
    const errors: FieldErrors = {}

    if (!form.name.trim()) errors.name = 'Informe o nome da station.'
    if (!form.address.trim()) errors.address = 'Informe o endereço.'

    const latitude = toNumber(form.latitude)
    if (latitude == null) errors.latitude = 'Latitude inválida.'

    const longitude = toNumber(form.longitude)
    if (longitude == null) errors.longitude = 'Longitude inválida.'

    const pricePerKwh = toNumber(form.pricePerKwh)
    if (pricePerKwh == null || pricePerKwh < 0) errors.pricePerKwh = 'Informe um preço válido, ex.: 0,89.'

    const contractedDemandKw = toNumber(form.contractedDemandKw)
    if (contractedDemandKw == null || contractedDemandKw < 0) {
      errors.contractedDemandKw = 'Informe uma demanda contratada válida, ex.: 50.'
    }

    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return null

    return {
      name: form.name.trim(),
      address: form.address.trim(),
      latitude: latitude as number,
      longitude: longitude as number,
      pricePerKwh: pricePerKwh as number,
      contractedDemandKw: contractedDemandKw as number,
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const input = validate()
    if (!input) return

    setError(null)
    setLoading(true)
    try {
      const station = await stationsApi.create(input)
      onCreated(station)
      setForm(EMPTY_FORM)
      setFieldErrors({})
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      title="Adicionar station"
      description="Cadastre uma nova usina para vincular carregadores a ela."
      onClose={close}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <TextField
          label="Nome"
          value={form.name}
          error={fieldErrors.name}
          onChange={(e) => updateField('name', e.target.value)}
        />
        <TextField
          label="Endereço"
          value={form.address}
          error={fieldErrors.address}
          onChange={(e) => updateField('address', e.target.value)}
        />
        <div className={styles.row}>
          <TextField
            label="Latitude"
            inputMode="decimal"
            value={form.latitude}
            error={fieldErrors.latitude}
            onChange={(e) => updateField('latitude', e.target.value)}
          />
          <TextField
            label="Longitude"
            inputMode="decimal"
            value={form.longitude}
            error={fieldErrors.longitude}
            onChange={(e) => updateField('longitude', e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <TextField
            label="Preço por kWh (R$)"
            inputMode="decimal"
            value={form.pricePerKwh}
            error={fieldErrors.pricePerKwh}
            onChange={(e) => updateField('pricePerKwh', e.target.value)}
          />
          <TextField
            label="Demanda contratada (kW)"
            inputMode="decimal"
            value={form.contractedDemandKw}
            error={fieldErrors.contractedDemandKw}
            onChange={(e) => updateField('contractedDemandKw', e.target.value)}
          />
        </div>
        <InlineError message={error} />
        <div className={styles.actions}>
          <Button variant="ghost" onClick={close} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            Adicionar station
          </Button>
        </div>
      </form>
    </Modal>
  )
}
