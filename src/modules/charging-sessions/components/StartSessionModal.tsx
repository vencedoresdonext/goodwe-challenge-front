import { useState, type FormEvent } from 'react'
import { getErrorMessage } from '../../../lib/http'
import { Button, InlineError, Modal, TextField } from '../../../shared/components'
import { formatCurrency } from '../../../shared/utils'
import { chargingSessionsApi } from '../api/charging-sessions.api'
import type { ChargingSession } from '../types'
import styles from './SessionForm.module.css'

interface StartSessionModalProps {
  open: boolean
  chargerId: string | null
  chargerLabel?: string
  pricePerKwh?: number
  onClose: () => void
  onStarted: (session: ChargingSession) => void
}

const DEFAULT_AMOUNT = '50'

// Converte "50", "50,5" ou "1.234,90" em centavos.
function toCents(value: string): number | null {
  const normalized = value.replace(/\./g, '').replace(',', '.').trim()
  const amount = Number(normalized)
  if (!normalized || !Number.isFinite(amount) || amount < 0) return null
  return Math.round(amount * 100)
}

export function StartSessionModal({
  open,
  chargerId,
  chargerLabel,
  pricePerKwh,
  onClose,
  onStarted,
}: StartSessionModalProps) {
  const [amount, setAmount] = useState(DEFAULT_AMOUNT)
  const [vehicleId, setVehicleId] = useState('')
  const [amountError, setAmountError] = useState<string>()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const cents = toCents(amount)
  const estimatedKwh = cents != null && pricePerKwh ? cents / 100 / pricePerKwh : null

  function close() {
    if (loading) return
    setAmount(DEFAULT_AMOUNT)
    setVehicleId('')
    setAmountError(undefined)
    setError(null)
    onClose()
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!chargerId) return
    if (cents == null) {
      setAmountError('Informe um valor válido, ex.: 50 ou 49,90.')
      return
    }
    setAmountError(undefined)
    setError(null)
    setLoading(true)
    try {
      const session = await chargingSessionsApi.start({
        chargerId,
        preAuthorizedAmountCents: cents,
        ...(vehicleId.trim() ? { vehicleId: vehicleId.trim() } : {}),
      })
      onStarted(session)
      setAmount(DEFAULT_AMOUNT)
      setVehicleId('')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      title="Iniciar recarga"
      description={chargerLabel ? `Carregador ${chargerLabel}` : undefined}
      onClose={close}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <TextField
          label="Valor pré-autorizado (R$)"
          inputMode="decimal"
          value={amount}
          error={amountError}
          hint={
            estimatedKwh != null
              ? `Cobre cerca de ${estimatedKwh.toFixed(1).replace('.', ',')} kWh a ${formatCurrency(pricePerKwh)}/kWh.`
              : 'Limite reservado para a recarga. O valor final é calculado pela energia entregue.'
          }
          onChange={(e) => setAmount(e.target.value)}
        />
        <TextField
          label="ID do veículo (opcional)"
          value={vehicleId}
          hint="Deixe em branco se a recarga não estiver associada a um veículo cadastrado."
          onChange={(e) => setVehicleId(e.target.value)}
        />
        <InlineError message={error} />
        <div className={styles.actions}>
          <Button variant="ghost" onClick={close} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading} disabled={!chargerId}>
            Iniciar recarga
          </Button>
        </div>
      </form>
    </Modal>
  )
}
