import { ConnectorStatus, normalizeConnectorType } from '../../../../shared/constants/enums'
import { parseDecimal, toDecimalInput } from '../../../../shared/utils'
import type { ChargerInput, Connector } from '../../types'

export const MAX_CHARGER_POWER_KW = 400

export interface ChargerFormState {
  /** Só para a key da lista no React */
  uid: string
  connectorType: string
  maxPowerKw: string
  pricePerKwh: string
  statusId: ConnectorStatus
}

export type ChargerFieldErrors = Partial<Record<'connectorType' | 'maxPowerKw' | 'pricePerKwh', string>>

let uidCounter = 0
const nextUid = () => `charger-${++uidCounter}`

export const emptyCharger = (): ChargerFormState => ({
  uid: nextUid(),
  connectorType: '',
  maxPowerKw: '',
  pricePerKwh: '',
  statusId: ConnectorStatus.AVAILABLE,
})

export const chargerFromConnector = (connector: Connector): ChargerFormState => ({
  uid: nextUid(),
  connectorType: normalizeConnectorType(connector.connectorType),
  maxPowerKw: toDecimalInput(connector.maxPowerKw),
  pricePerKwh: toDecimalInput(connector.pricePerKwh),
  statusId: connector.statusId,
})

export function validateCharger(form: ChargerFormState): { input: ChargerInput | null; errors: ChargerFieldErrors } {
  const errors: ChargerFieldErrors = {}

  if (!form.connectorType) errors.connectorType = 'Escolha o tipo de conector.'

  const maxPowerKw = parseDecimal(form.maxPowerKw)
  if (maxPowerKw == null || maxPowerKw < 1 || maxPowerKw > MAX_CHARGER_POWER_KW) {
    errors.maxPowerKw = `Entre 1 e ${MAX_CHARGER_POWER_KW} kW.`
  }

  // Preço é opcional: vazio = herda o da station
  const pricePerKwh = form.pricePerKwh.trim() ? parseDecimal(form.pricePerKwh) : undefined
  if (pricePerKwh === null || (pricePerKwh != null && pricePerKwh < 0)) {
    errors.pricePerKwh = 'Preço inválido, ex.: 0,89.'
  }

  if (Object.keys(errors).length > 0) return { input: null, errors }

  return {
    errors,
    input: {
      connectorType: form.connectorType,
      maxPowerKw: maxPowerKw as number,
      ...(pricePerKwh != null && { pricePerKwh }),
    },
  }
}
