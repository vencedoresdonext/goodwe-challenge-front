import { useState, type FormEvent } from 'react'
import { getErrorMessage } from '../../../../lib/http'
import { Button, InlineError, Modal, TextField } from '../../../../shared/components'
import { parseDecimal } from '../../../../shared/utils'
import { stationsApi } from '../../api/stations.api'
import type { ChargerInput, CreateStationInput, Station } from '../../types'
import { AddressLookupField } from '../AddressLookup/AddressLookupField'
import { useAddressLookup } from '../AddressLookup/useAddressLookup'
import { emptyCharger, validateCharger, type ChargerFieldErrors, type ChargerFormState } from '../ChargerFields/charger-form'
import { ChargersFieldset } from '../ChargerFields/ChargersFieldset'
import styles from './StationForm.module.css'

interface AddStationModalProps {
  open: boolean
  onClose: () => void
  onCreated: (station: Station) => void
}

interface FormState {
  name: string
  address: string
  pricePerKwh: string
  contractedDemandKw: string
}

const EMPTY_FORM: FormState = {
  name: '',
  address: '',
  pricePerKwh: '',
  contractedDemandKw: '',
}

type FieldErrors = Partial<Record<keyof FormState, string>>

export function AddStationModal({ open, onClose, onCreated }: AddStationModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [chargers, setChargers] = useState<ChargerFormState[]>(() => [emptyCharger()])
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [chargerErrors, setChargerErrors] = useState<Record<string, ChargerFieldErrors>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const lookup = useAddressLookup()

  const stationPrice = parseDecimal(form.pricePerKwh)
  const contractedDemand = parseDecimal(form.contractedDemandKw)

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function resetForm() {
    setForm(EMPTY_FORM)
    setChargers([emptyCharger()])
    setFieldErrors({})
    setChargerErrors({})
    setError(null)
    lookup.reset()
  }

  function close() {
    if (loading) return
    resetForm()
    onClose()
  }

  function validateFields(): { errors: FieldErrors; chargersInput: ChargerInput[] | null } {
    const errors: FieldErrors = {}

    if (!form.name.trim()) errors.name = 'Informe o nome da station.'
    if (!form.address.trim()) errors.address = 'Informe o endereço.'

    if (stationPrice == null || stationPrice < 0) errors.pricePerKwh = 'Informe um preço válido, ex.: 0,89.'
    if (contractedDemand == null || contractedDemand <= 0) {
      errors.contractedDemandKw = 'Informe uma demanda contratada válida, ex.: 50.'
    }

    const perCharger: Record<string, ChargerFieldErrors> = {}
    const chargersInput: ChargerInput[] = []
    for (const charger of chargers) {
      const { input, errors: e } = validateCharger(charger)
      if (input) chargersInput.push(input)
      else perCharger[charger.uid] = e
    }
    setChargerErrors(perCharger)

    return { errors, chargersInput: Object.keys(perCharger).length ? null : chargersInput }
  }

  async function resolveLocation() {
    if (lookup.location) return lookup.location
    if (lookup.manual) return null // coordenadas manuais inválidas: o campo já mostra o erro
    if (lookup.status === 'choosing') return null // aguardando o usuário escolher na lista

    // Ainda não buscou: busca agora. Se vier um único resultado exato, segue direto.
    const { selected } = await lookup.search(form.address)
    if (!selected) return null
    updateField('address', selected.label)
    return { latitude: selected.latitude, longitude: selected.longitude, label: selected.label }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    const { errors, chargersInput } = validateFields()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0 || !chargersInput) return

    setLoading(true)
    try {
      const location = await resolveLocation()
      if (!location) {
        setFieldErrors((prev) => ({
          ...prev,
          address: lookup.manual ? undefined : 'Confirme a localização do endereço antes de salvar.',
        }))
        return
      }

      const input: CreateStationInput = {
        name: form.name.trim(),
        address: ('label' in location ? location.label : form.address).trim(),
        latitude: location.latitude,
        longitude: location.longitude,
        pricePerKwh: stationPrice as number,
        contractedDemandKw: contractedDemand as number,
        chargers: chargersInput,
      }

      const station = await stationsApi.create(input)
      onCreated(station)
      resetForm()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      size="lg"
      title="Adicionar station"
      description="Cadastre a usina e os carregadores instalados nela."
      onClose={close}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <TextField
          label="Nome"
          placeholder="Ex.: Estação Vila Mariana"
          value={form.name}
          error={fieldErrors.name}
          onChange={(e) => updateField('name', e.target.value)}
        />

        <AddressLookupField
          value={form.address}
          lookup={lookup}
          error={fieldErrors.address}
          onChange={(address) => {
            updateField('address', address)
            if (fieldErrors.address) setFieldErrors((prev) => ({ ...prev, address: undefined }))
          }}
          disabled={loading}
        />

        <div className={styles.row}>
          <TextField
            label="Preço por kWh (R$)"
            inputMode="decimal"
            placeholder="0,89"
            value={form.pricePerKwh}
            error={fieldErrors.pricePerKwh}
            onChange={(e) => updateField('pricePerKwh', e.target.value)}
          />
          <TextField
            label="Demanda contratada (kW)"
            inputMode="decimal"
            placeholder="50"
            value={form.contractedDemandKw}
            error={fieldErrors.contractedDemandKw}
            onChange={(e) => updateField('contractedDemandKw', e.target.value)}
          />
        </div>

        <ChargersFieldset
          chargers={chargers}
          errors={chargerErrors}
          onChange={setChargers}
          stationPricePerKwh={stationPrice}
          contractedDemandKw={contractedDemand}
          disabled={loading}
        />

        <InlineError message={error} />
        <div className={styles.actions}>
          <Button variant="ghost" onClick={close} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {chargers.length > 1 ? `Adicionar station com ${chargers.length} carregadores` : 'Adicionar station'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
