import { CHARGER_MODEL, ConnectorStatus } from '../../../../shared/constants/enums'
import { parseDecimal, toDecimalInput } from '../../../../shared/utils'
import type { ChargerInput, Connector } from '../../types'

export const MAX_CHARGER_POWER_KW = CHARGER_MODEL.maxPowerKw

export interface ChargerFormState {
  /** Só para a key da lista no React */
  uid: string
  maxPowerKw: string
  pricePerKwh: string
  statusId: ConnectorStatus
}

export type ChargerFieldErrors = Partial<Record<'maxPowerKw' | 'pricePerKwh', string>>

let uidCounter = 0
const nextUid = () => `charger-${++uidCounter}`

export const emptyCharger = (): ChargerFormState => ({
  uid: nextUid(),
  maxPowerKw: toDecimalInput(CHARGER_MODEL.defaultPowerKw),
  pricePerKwh: '',
  statusId: ConnectorStatus.AVAILABLE,
})

export const chargerFromConnector = (connector: Connector): ChargerFormState => ({
  uid: nextUid(),
  maxPowerKw: toDecimalInput(connector.maxPowerKw),
  pricePerKwh: toDecimalInput(connector.pricePerKwh),
  statusId: connector.statusId,
})

/**
 * @param currentPowerKw na edição, potência atual do carregador. Carregadores
 * antigos (ex.: do seed, com 22 kW) podem manter a potência sem bloquear a
 * edição dos outros campos; só um valor novo precisa respeitar o limite.
 */
export function validateCharger(
  form: ChargerFormState,
  currentPowerKw?: number,
): { input: ChargerInput | null; errors: ChargerFieldErrors } {
  const errors: ChargerFieldErrors = {}

  const maxPowerKw = parseDecimal(form.maxPowerKw)
  const unchanged = maxPowerKw != null && maxPowerKw === currentPowerKw
  if (maxPowerKw == null || maxPowerKw < 1 || (!unchanged && maxPowerKw > MAX_CHARGER_POWER_KW)) {
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
      connectorType: CHARGER_MODEL.connectorType,
      maxPowerKw: maxPowerKw as number,
      ...(pricePerKwh != null && { pricePerKwh }),
    },
  }
}
