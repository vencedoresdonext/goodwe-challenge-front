const BASE_URL = import.meta.env.VITE_API_URL

export const tokenStorage = {
  get access() { return localStorage.getItem('accessToken') },
  get refresh() { return localStorage.getItem('refreshToken') },
  set(tokens: { accessToken: string; refreshToken: string }) {
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
  },
  clear() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.access

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (response.status === 401 && !path.startsWith('/auth/')) {
    tokenStorage.clear()
    window.location.href = '/login'
    throw new Error('Não autorizado')
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    // class-validator devolve message como array
    const message = Array.isArray(body.message) ? body.message.join('\n') : body.message
    throw new Error(message ?? `Erro ${response.status}`)
  }

  const body = await response.json()
  return (body.data ?? body) as T
}
