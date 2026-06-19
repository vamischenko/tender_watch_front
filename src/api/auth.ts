import http from './http'
import type { ApiResponse, AuthData, LoginRequest } from '@/types'

export const authApi = {
  login(data: LoginRequest) {
    return http.post<ApiResponse<AuthData>>('/auth/login', data).then((r) => r.data)
  },
}
