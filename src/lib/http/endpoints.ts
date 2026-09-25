const id = (value: string) => encodeURIComponent(value)

export const endpoints = {
  health: {
    live: '/health/live',
  },
  auth: {
    login: '/auth/web/login',
    signup: '/auth/web/signup',
    refresh: '/auth/web/refresh',
  },
  users: {
    me: '/users/web/me',
  },
  stations: {
    list: '/stations/web',
    detail: (stationId: string) => `/stations/web/${id(stationId)}`,
    linkCard: (chargerId: string) => `/stations/web/stations/chargers/${id(chargerId)}/card`,
    geocode: '/stations/web/geocode',
    chargers: (stationId: string) => `/stations/web/${id(stationId)}/chargers`,
    charger: (chargerId: string) => `/stations/web/chargers/${id(chargerId)}`,
    energyDashboard: '/stations/web/dashboard/energy',
  },
  chargingSessions: {
    list: '/charging-session/web/sessions',
    status: (sessionId: string) => `/charging-session/web/${id(sessionId)}/status`,
    start: '/charging-session/web/start',
    stop: (sessionId: string) => `/charging-session/web/${id(sessionId)}/stop`,
  },
  payment: {
    cards: '/payment/web/cards',
    tokenizeCard: '/payment/web/cards/tokenize',
    deleteCard: (cardId: string) => `/payment/web/cards/${id(cardId)}`,
    transactions: '/payment/web/transactions',
  },
} as const

// Rotas que nunca devem disparar a renovação automática de token
export const AUTH_ENDPOINTS: readonly string[] = [
  endpoints.auth.login,
  endpoints.auth.signup,
  endpoints.auth.refresh,
]
