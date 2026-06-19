import http from './http'
import type { NotificationFilters, NotificationLog, PaginatedResponse } from '@/types'

export const notificationsApi = {
  list(filters: NotificationFilters = {}) {
    const params: Record<string, unknown> = {}
    if (filters.subscription_id) params.subscription_id = filters.subscription_id
    if (filters.status && filters.status !== 'all') params.status = filters.status
    if (filters.page) params.page = filters.page
    if (filters.per_page) params.per_page = filters.per_page
    return http
      .get<PaginatedResponse<NotificationLog>>('/notifications', { params })
      .then((r) => r.data)
  },
}
