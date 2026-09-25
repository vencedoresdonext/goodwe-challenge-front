import { useState, type FormEvent } from 'react'
import { getErrorMessage } from '../../../../lib/http'
import { Button, InlineError, Modal, SelectField } from '../../../../shared/components'
import { ConnectorStatus } from '../../../../shared/constants/enums'
import { stationsApi } from '../../api/stations.api'
import type { Connector, UpdateChargerInput } from '../../types'
import { chargerFromConnector, emptyCharger, validateCharger, type ChargerFieldErrors, type ChargerFormState } from '../ChargerFields/charger-form'
import { ChargerFields } from '../ChargerFields/ChargerFields'
import { ChargerModel } from '../ChargerFields/ChargerModel'
import styles from '../AddStation/StationForm.module.css'

const STATUS_OPTIONS = [
  { value: ConnectorStatus.AVAILABLE, label: 'Livre (disponível para recarga)' },
  { value: ConnectorStatus.OFFLINE, label: 'Offline (em manutenção)' },
  { value: ConnectorStatus.FAULTED, label: 'Com falha' },
]

type ChargerFormModalProps = {
  open: boolean
  stationId: string
  stationPricePerKwh: number
  onClose: () => void
  onSaved: (connector: Connector, mode: 'create' | 'edit') => void
} & (
  | { mode: 'create'; connector?: undefined; label?: undefined }
  | { mode: 'edit'; connector: Connector; label: string }
)

export function ChargerFormModal(props: ChargerFormModalProps) {
  const [loading, setLoading] = useState(false)
  const close = () => {
    if (!loading) props.onClose()
  }

  return (
    <Modal
      open={props.open}
      title={props.mode === 'create' ? 'Novo carregador' : `Editar ${props.label}`}
      description={
        props.mode === 'create'
          ? 'O carregador fica disponível para recarga assim que for criado.'
          : 'Altere os dados do carregador. Recargas em andamento não são afetadas.'
      }
      onClose={close}
    >
      {/* O Modal só monta o conteúdo quando aberto: o formulário nasce preenchido a cada abertura */}
      <ChargerForm {...props} loading={loading} setLoading={setLoading} onCancel={close} />
    </Modal>
  )
}

type ChargerFormProps = ChargerFormModalProps & {
  loading: boolean
  setLoading: (loading: boolean) => void
  onCancel: () => void
}

function ChargerForm(props: ChargerFormProps) {
  const { mode, connector, stationId, stationPricePerKwh, onClose, onSaved, loading, setLoading, onCancel } = props
  const [form, setForm] = useState<ChargerFormState>(() => (connector ? chargerFromConnector(connector) : emptyCharger()))
  const [errors, setErrors] = useState<ChargerFieldErrors>({})
  const [error, setError] = useState<string | null>(null)

  const occupied = connector?.statusId === ConnectorStatus.OCCUPIED

  // Na edição manda só o que mudou
  function diff(input: ReturnType<typeof validateCharger>['input']): UpdateChargerInput {
    if (!input || !connector) return {}
    const changes: UpdateChargerInput = {}
    if (input.connectorType !== connector.connectorType) changes.connectorType = input.connectorType
    if (input.maxPowerKw !== connector.maxPowerKw) changes.maxPowerKw = input.maxPowerKw
    if (input.pricePerKwh != null && input.pricePerKwh !== connector.pricePerKwh) changes.pricePerKwh = input.pricePerKwh
    // Preço apagado na edição = volta a seguir o preço da station
    if (input.pricePerKwh == null && connector.pricePerKwh !== stationPricePerKwh) changes.pricePerKwh = stationPricePerKwh
    if (!occupied && form.statusId !== connector.statusId) changes.statusId = form.statusId
    return changes
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const { input, errors: validation } = validateCharger(form, connector?.maxPowerKw)
    setErrors(validation)
    if (!input) return

    setError(null)
    setLoading(true)
    try {
      if (mode === 'create') {
        const created = await stationsApi.createCharger(stationId, input)
        onSaved(created, 'create')
      } else {
        const changes = diff(input)
        if (Object.keys(changes).length === 0) {
          onClose()
          return
        }
        const updated = await stationsApi.updateCharger(connector.chargerId, changes)
        onSaved(updated, 'edit')
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <ChargerModel />
        <ChargerFields
          value={form}
          errors={errors}
          stationPricePerKwh={stationPricePerKwh}
          onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
          disabled={loading}
        />

        {mode === 'edit' && (
          <SelectField
            label="Status"
            value={occupied ? ConnectorStatus.OCCUPIED : form.statusId}
            options={occupied ? [{ value: ConnectorStatus.OCCUPIED, label: 'Ocupado (recarga em andamento)' }] : STATUS_OPTIONS}
            hint={
              occupied
                ? 'O status não pode ser alterado durante uma recarga.'
                : 'Coloque em "Offline" para bloquear novas recargas durante a manutenção.'
            }
            onChange={(e) => setForm((prev) => ({ ...prev, statusId: Number(e.target.value) as ConnectorStatus }))}
            disabled={loading || occupied}
          />
        )}

        <InlineError message={error} />
        <div className={styles.actions}>
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {mode === 'create' ? 'Adicionar carregador' : 'Salvar alterações'}
          </Button>
        </div>
      </form>
  )
}
