import type { JwtPayload } from './types'

// decodificação
export function decodeJwt(token: string | null | undefined): JwtPayload | null {
  if (!token) return null
  const [, payload] = token.split('.')
  if (!payload) return null
  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes)) as JwtPayload
  } catch {
    return null
  }
}

// true se o token expira na janela informada (ou já expirou)
export function isTokenExpiringSoon(token: string | null | undefined, windowMs = 60_000): boolean {
  const exp = decodeJwt(token)?.exp
  if (!exp) return false
  return exp * 1000 - Date.now() <= windowMs
}

export function isTokenExpired(token: string | null | undefined): boolean {
  return isTokenExpiringSoon(token, 0)
}
