import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { env } from '../../config/env'
import { AUTH_ENDPOINTS, endpoints } from './endpoints'
import { unwrapEnvelope } from './envelope'
import { toApiError } from './errors'
import { isTokenExpired, isTokenExpiringSoon } from './jwt'
import { tokenStorage } from './token-storage'
import type { AuthTokens } from './types'

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

const httpClient = axios.create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeout,
  headers: { 'Content-Type': 'application/json' },
})

// Sessão expirada

type Listener = () => void
const unauthorizedListeners = new Set<Listener>()

export function onUnauthorized(listener: Listener): () => void {
  unauthorizedListeners.add(listener)
  return () => {
    unauthorizedListeners.delete(listener)
  }
}

function notifyUnauthorized() {
  tokenStorage.clear()
  unauthorizedListeners.forEach((listener) => listener())
}

// Renovação de token

let refreshPromise: Promise<string | null> | null = null

const isAuthEndpoint = (url?: string) => !!url && AUTH_ENDPOINTS.some((path) => url.endsWith(path))

// Chama POST /auth/web/refresh.
async function requestTokenRefresh(): Promise<string | null> {
  const { access, refresh } = tokenStorage
  if (!refresh || !access || isTokenExpired(access)) return null

  try {
    const response = await axios.post(
      `${env.apiUrl}${endpoints.auth.refresh}`,
      { refreshToken: refresh },
      { headers: { Authorization: `Bearer ${access}` }, timeout: env.apiTimeout },
    )
    const tokens = unwrapEnvelope<AuthTokens>(response.data)
    tokenStorage.set(tokens)
    return tokens.accessToken
  } catch {
    return null
  }
}

export function refreshAccessToken(): Promise<string | null> {
  refreshPromise ??= requestTokenRefresh().finally(() => {
    refreshPromise = null
  })
  return refreshPromise
}

// Interceptors

httpClient.interceptors.request.use(async (config) => {
  if (isAuthEndpoint(config.url)) return config

  let token = tokenStorage.access
  if (token && tokenStorage.refresh && isTokenExpiringSoon(token)) {
    token = (await refreshAccessToken()) ?? token
  }
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as RetriableConfig | undefined
    const status = error.response?.status

    if (status === 401 && config && !config._retry && !isAuthEndpoint(config.url)) {
      config._retry = true
      const newToken = await refreshAccessToken()
      if (newToken) {
        config.headers.set('Authorization', `Bearer ${newToken}`)
        return httpClient(config)
      }
      notifyUnauthorized()
    }

    return Promise.reject(toApiError(error))
  },
)

// API pública

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await httpClient.request(config)
  return unwrapEnvelope<T>(response.data)
}

export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'GET', url }),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'POST', url, data }),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PATCH', url, data }),
  delete: <T>(url: string, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'DELETE', url }),
}
