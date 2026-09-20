export const paymentService = {
  createPix: (data: PixPayload) =>
    api.post("/payment/checkout/pix", data).then((r) => r.data),
  payWithCard: (data: CardPaymentPayload) =>
    api.post("/payment/checkout/credit-card", data).then((r) => r.data),
};
