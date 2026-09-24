export const paths = {
  login: '/login',
  register: '/cadastro',
  stations: '/usinas',
  stationDetail: (stationId: string) => `/usinas/${encodeURIComponent(stationId)}`,
  sessions: '/sessoes',
  sessionDetail: (sessionId: string) => `/sessoes/${encodeURIComponent(sessionId)}`,
  transactions: '/transacoes',
  cards: '/cartoes',
  settings: '/configuracao',
} as const
