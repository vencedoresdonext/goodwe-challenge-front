import { AxiosError } from 'axios'

interface ErrorBody {
  message?: string | string[]
  errors?: unknown
}

export class ApiError extends Error {
  readonly status: number
  readonly details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }

  get isUnauthorized() {
    return this.status === 401
  }

  get isNotFound() {
    return this.status === 404
  }

  get isNetworkError() {
    return this.status === 0
  }
}

const FALLBACK_BY_STATUS: Record<number, string> = {
  0: 'Não foi possível conectar à API. Verifique sua conexão ou se o servidor está no ar.',
  400: 'Os dados enviados são inválidos. Revise os campos e tente novamente.',
  401: 'Sua sessão expirou. Entre novamente.',
  403: 'Você não tem permissão para esta ação.',
  404: 'Registro não encontrado.',
  408: 'A API demorou para responder. Tente novamente.',
  409: 'Esta ação conflita com o estado atual do registro.',
  429: 'Muitas requisições em pouco tempo. Aguarde e tente novamente.',
  500: 'Ocorreu um erro no servidor. Tente novamente mais tarde.',
}

// mensagens genéricas
const GENERIC_MESSAGES = new Set(['Bad Request Exception', 'Bad Request', 'Internal server error'])

function extractMessage(body: ErrorBody | undefined): string | undefined {
  if (!body?.message) return undefined
  const message = Array.isArray(body.message) ? body.message.join('\n') : body.message
  return GENERIC_MESSAGES.has(message) ? undefined : message
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (error instanceof AxiosError) {
    if (error.code === AxiosError.ECONNABORTED || error.code === AxiosError.ETIMEDOUT) {
      return new ApiError(FALLBACK_BY_STATUS[408], 408)
    }
    const status = error.response?.status ?? 0
    const body = error.response?.data as ErrorBody | undefined
    const fallback = FALLBACK_BY_STATUS[status] ?? FALLBACK_BY_STATUS[status >= 500 ? 500 : 400]
    return new ApiError(extractMessage(body) ?? fallback, status, body?.errors)
  }

  if (error instanceof Error) return new ApiError(error.message, 0)
  return new ApiError('Erro inesperado.', 0)
}

export function getErrorMessage(error: unknown): string {
  return toApiError(error).message
}
