import { useState } from 'react'
import { getErrorMessage } from '../../../lib/http'
import { Button, InlineError, Modal, SelectField } from '../../../shared/components'
import { PAYMENT_METHOD_LABEL, PaymentMethod } from '../../../shared/constants/enums'
import { chargingSessionsApi } from '../api/charging-sessions.api'
import type { ChargingSession } from '../types'

interface StopSessionModalProps {
  open: boolean
  sessionId: string
  onClose: () => void
  onStopped: (session: ChargingSession) => void
}

const OPTIONS = [PaymentMethod.CREDIT_CARD, PaymentMethod.PIX].map((value) => ({
  value,
  label: PAYMENT_METHOD_LABEL[value],
}))

export function StopSessionModal({ open, sessionId, onClose, onStopped }: StopSessionModalProps) {
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleStop() {
    setError(null)
    setLoading(true)
    try {
      const session = await chargingSessionsApi.stop(sessionId, { paymentMethodId: method })
      onStopped(session)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      title="Encerrar recarga"
      description="O carregador será desligado e o valor final será calculado pela energia entregue."
      onClose={() => !loading && onClose()}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Continuar carregando
          </Button>
          <Button onClick={handleStop} loading={loading}>
            Encerrar recarga
          </Button>
        </>
      }
    >
      <SelectField
        label="Forma de pagamento"
        value={method}
        options={OPTIONS}
        onChange={(e) => setMethod(Number(e.target.value) as PaymentMethod)}
      />
      <InlineError message={error} />
    </Modal>
  )
}
