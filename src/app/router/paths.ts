export const paths = {
  login: '/login',
  register: '/cadastro',
  stations: '/stations',
  stationDetail: (stationId: string) => `/stations/${encodeURIComponent(stationId)}`,
  sessions: '/sessoes',
  sessionDetail: (sessionId: string) => `/sessoes/${encodeURIComponent(sessionId)}`,
  transactions: '/transacoes',
  cards: '/cartoes',
  settings: '/configuracao',
} as const
