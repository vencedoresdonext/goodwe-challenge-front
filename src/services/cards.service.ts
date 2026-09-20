export const cardsService = {
  list: () => api.get<Card[]>("/payment/web/cards").then((r) => r.data),
  remove: (id: string) => api.delete(`/payment/web/cards/${id}`),
  tokenize: (data: TokenizePayload) =>
    api.post("/payment/web/cards/tokenize", data).then((r) => r.data),
};