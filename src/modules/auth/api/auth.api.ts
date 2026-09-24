import { endpoints, http, type AuthTokens } from '../../../lib/http'
import type { LoginRequest, SignupRequest } from '../types'

export const authApi = {
  login: (body: LoginRequest) => http.post<AuthTokens>(endpoints.auth.login, body),
  signup: (body: SignupRequest) => http.post<AuthTokens>(endpoints.auth.signup, body),
}
