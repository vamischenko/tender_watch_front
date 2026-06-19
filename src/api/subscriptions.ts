import http from './http'
import type {
  ApiResponse,
  CreateSubscriptionRequest,
  FilterCriteria,
  Subscription,
  SubscriptionPreview,
  UpdateSubscriptionRequest,
} from '@/types'

export const subscriptionsApi = {
  list() {
    return http.get<ApiResponse<Subscription[]>>('/subscriptions').then((r) => r.data)
  },

  create(data: CreateSubscriptionRequest) {
    return http.post<ApiResponse<Subscription>>('/subscriptions', data).then((r) => r.data)
  },

  update(id: string, data: UpdateSubscriptionRequest) {
    return http.patch<ApiResponse<Subscription>>(`/subscriptions/${id}`, data).then((r) => r.data)
  },

  remove(id: string) {
    return http.delete<ApiResponse<null>>(`/subscriptions/${id}`).then((r) => r.data)
  },

  preview(criteria: Partial<FilterCriteria>, signal?: AbortSignal) {
    return http
      .get<ApiResponse<SubscriptionPreview>>('/subscriptions/preview', { params: criteria, signal })
      .then((r) => r.data)
  },
}
