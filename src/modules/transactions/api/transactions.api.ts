import { endpoints, http, type PaginationParams } from '../../../lib/http'
import type { PaymentTransaction } from '../types'

export const transactionsApi = {
  list: (params: PaginationParams = {}) =>
    http.get<PaymentTransaction[]>(endpoints.payment.transactions, { params }),
}
