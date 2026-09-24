import { endpoints, http } from '../../../lib/http'
import type { Profile, UpdateProfileRequest } from '../types'

export const usersApi = {
  getMe: () => http.get<Profile>(endpoints.users.me),
  updateMe: (body: UpdateProfileRequest) => http.patch<Profile>(endpoints.users.me, body),
}
