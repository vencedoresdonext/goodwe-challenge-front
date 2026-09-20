import { api } from "../api"

export const login = (username: string, password: string) =>
  api<{ token: string }>('/auth/web/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })

export const register = (username: string, password: string) =>
  api<void>('/auth/web/signup', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
