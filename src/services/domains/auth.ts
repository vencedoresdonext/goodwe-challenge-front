import { api } from '../api'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export const login = async (identifier: string, password: string) => {
  const res = await api<{ data: AuthTokens }>('/auth/web/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  })
  return res.data
}

export const register = (data: {
  email: string
  fullName: string
  phone: string
  password: string
}) =>
  api<AuthTokens>('/auth/web/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  })
