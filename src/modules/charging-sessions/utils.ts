import { ChargerSessionStatus } from '../../shared/constants/enums'
import type { ChargingSession } from './types'

const ACTIVE_STATUSES = new Set<number>([ChargerSessionStatus.AUTHORIZED, ChargerSessionStatus.CHARGING])

export const isActiveSession = (session: Pick<ChargingSession, 'statusId'>) => ACTIVE_STATUSES.has(session.statusId)

export const canStopSession = (session: Pick<ChargingSession, 'statusId'>) =>
  session.statusId === ChargerSessionStatus.CHARGING
