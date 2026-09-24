export interface LoginRequest {
  identifier: string
  password: string
}

export interface SignupRequest {
  email: string
  fullName: string
  phone: string
  password: string
}
