import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { decodeJwt, isTokenExpired, onUnauthorized, tokenStorage, type AuthTokens } from '../../../lib/http'
import { usersApi } from '../../users/api/users.api'
import type { Profile } from '../../users/types'
import { authApi } from '../api/auth.api'
import type { LoginRequest, SignupRequest } from '../types'
import { AuthContext, type AuthContextValue, type AuthStatus } from './auth-context'

function profileFromToken(token: string | null): Profile | null {
  const payload = decodeJwt(token)
  if (!payload) return null
  return { id: payload.sub, email: payload.email, fullName: null, phone: null, createdAt: '' }
}

function hasUsableSession() {
  const { access, refresh } = tokenStorage
  return !!access && !!refresh && !isTokenExpired(access)
}

interface SessionResult {
  status: Exclude<AuthStatus, 'loading'>
  user: Profile | null
}

async function resolveSession(): Promise<SessionResult> {
  try {
    return { status: 'authenticated', user: await usersApi.getMe() }
  } catch (error) {
    if ((error as { status?: number }).status === 401) {
      tokenStorage.clear()
      return { status: 'unauthenticated', user: null }
    }
    return { status: 'authenticated', user: profileFromToken(tokenStorage.access) }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(() => (hasUsableSession() ? 'loading' : 'unauthenticated'))
  const [user, setUser] = useState<Profile | null>(null)
  const [sessionExpired, setSessionExpired] = useState(false)

  const applySession = useCallback((result: SessionResult) => {
    setUser(result.user)
    setStatus(result.status)
  }, [])

  const loadProfile = useCallback(async () => applySession(await resolveSession()), [applySession])

  useEffect(() => {
    if (!hasUsableSession()) {
      tokenStorage.clear()
      return
    }
    let active = true
    resolveSession().then((result) => {
      if (active) applySession(result)
    })
    return () => {
      active = false
    }
  }, [applySession])

  useEffect(
    () =>
      onUnauthorized(() => {
        setUser(null)
        setSessionExpired(true)
        setStatus('unauthenticated')
      }),
    [],
  )

  const startSession = useCallback(
    async (tokens: AuthTokens) => {
      tokenStorage.set(tokens)
      setSessionExpired(false)
      await loadProfile()
    },
    [loadProfile],
  )

  const login = useCallback(
    async (credentials: LoginRequest) => startSession(await authApi.login(credentials)),
    [startSession],
  )

  const register = useCallback(
    async (data: SignupRequest) => startSession(await authApi.signup(data)),
    [startSession],
  )

  const logout = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
    setSessionExpired(false)
    setStatus('unauthenticated')
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, sessionExpired, login, register, logout, setUser }),
    [status, user, sessionExpired, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
