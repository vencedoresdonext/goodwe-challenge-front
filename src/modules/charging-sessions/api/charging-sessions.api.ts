import { endpoints, http, type PaginationParams } from '../../../lib/http'
import type { ChargingSession, StartSessionRequest, StopSessionRequest } from '../types'

export const chargingSessionsApi = {
  list: (params: PaginationParams = {}) =>
    http.get<ChargingSession[]>(endpoints.chargingSessions.list, { params }),
  getStatus: (sessionId: string) => http.get<ChargingSession>(endpoints.chargingSessions.status(sessionId)),
  start: (body: StartSessionRequest) => http.post<ChargingSession>(endpoints.chargingSessions.start, body),
  stop: (sessionId: string, body: StopSessionRequest) =>
    http.post<ChargingSession>(endpoints.chargingSessions.stop(sessionId), body),
}
