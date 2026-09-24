import type { AuthTokens } from './types'

const ACCESS_KEY = 'goodwe.accessToken'
const REFRESH_KEY = 'goodwe.refreshToken'

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export const tokenStorage = {
  get access() {
    return read(ACCESS_KEY)
  },
  get refresh() {
    return read(REFRESH_KEY)
  },
  set(tokens: AuthTokens) {
    try {
      localStorage.setItem(ACCESS_KEY, tokens.accessToken)
      localStorage.setItem(REFRESH_KEY, tokens.refreshToken)
    } catch {
      // indisponível
    }
  },
  clear() {
    try {
      localStorage.removeItem(ACCESS_KEY)
      localStorage.removeItem(REFRESH_KEY)
    } catch {
      // ignor
    }
  },
}
