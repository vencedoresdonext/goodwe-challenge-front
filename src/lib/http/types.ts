export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface PaginationParams {
  skip?: number
  take?: number
}

export interface JwtPayload {
  sub: string
  email: string
  roles: number[]
  exp?: number
  iat?: number
}
