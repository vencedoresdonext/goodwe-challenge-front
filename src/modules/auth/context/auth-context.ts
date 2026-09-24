import { createContext } from 'react'
import type { Profile } from '../../users/types'
import type { LoginRequest, SignupRequest } from '../types'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthContextValue {
  status: AuthStatus
  user: Profile | null
  sessionExpired: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: SignupRequest) => Promise<void>
  logout: () => void
  setUser: (profile: Profile) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
