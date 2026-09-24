export interface Profile {
  id: string
  email: string
  fullName: string | null
  phone: string | null
  createdAt: string
}

export interface UpdateProfileRequest {
  fullName?: string
  phone?: string
}
