export interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: PaginationMeta
}

export interface PaginationMeta {
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}

// Auth
export interface LoginRequest {
  email: string
  password: string
}

export interface AuthData {
  token: string
}

export interface User {
  id: string
  email: string
}

// Tenders
export type TenderStatus = 'active' | 'closed'

export interface TenderBudget {
  amount: number
  currency: string
}

export interface Tender {
  id: string
  title: string
  description: string
  category_id: string
  budget: TenderBudget
  region: string
  published_at: string
  deadline_at: string
  is_expired: boolean
  status: TenderStatus
  created_at: string
}

export interface TenderFilters {
  q?: string
  category?: string
  region?: string
  min_budget?: number
  max_budget?: number
  page?: number
  per_page?: number
  sort?: 'deadline' | 'budget' | 'published'
}

// Categories
export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
}

// Subscriptions
export interface FilterCriteria {
  category_ids: string[]
  min_budget: number | null
  max_budget: number | null
  regions: string[]
  keywords: string[]
}

export type DeliveryChannel = 'email' | 'telegram'

export interface Subscription {
  id: string
  name: string
  criteria: FilterCriteria
  channels: DeliveryChannel[]
  is_active: boolean
  created_at: string
}

export interface CreateSubscriptionRequest {
  name: string
  criteria: FilterCriteria
  channels: DeliveryChannel[]
}

export interface UpdateSubscriptionRequest {
  name?: string
  criteria?: Partial<FilterCriteria>
  channels?: DeliveryChannel[]
  is_active?: boolean
}

export interface SubscriptionPreview {
  count: number
  examples: Tender[]
}

// Notifications
export type NotificationStatus = 'sent' | 'failed'

export interface NotificationLog {
  id: string
  tender_id: string
  tender_title: string
  subscription_id: string
  subscription_name: string
  channel: DeliveryChannel
  status: NotificationStatus
  error_message?: string
  sent_at: string
}

export interface NotificationFilters {
  subscription_id?: string
  status?: NotificationStatus | 'all'
  page?: number
  per_page?: number
}

// Toast
export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
}
