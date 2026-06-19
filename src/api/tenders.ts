import http from './http'
import type { ApiResponse, Category, PaginatedResponse, Tender, TenderFilters } from '@/types'

export const tendersApi = {
  list(filters: TenderFilters = {}) {
    const params: Record<string, unknown> = { ...filters }
    return http.get<PaginatedResponse<Tender>>('/tenders', { params }).then((r) => r.data)
  },

  get(id: string) {
    return http.get<ApiResponse<Tender>>(`/tenders/${id}`).then((r) => r.data)
  },

  categories() {
    return http.get<ApiResponse<Category[]>>('/categories').then((r) => r.data)
  },
}
