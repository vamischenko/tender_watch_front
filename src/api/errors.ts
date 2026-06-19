import axios from 'axios'

export interface ApiErrorBody {
  success: false
  message?: string
  errors?: Record<string, string[]>
}

export function isAxiosError(e: unknown): e is ReturnType<typeof axios.isAxiosError> & {
  response?: { status: number; data: ApiErrorBody }
} {
  return axios.isAxiosError(e)
}

export function getApiMessage(e: unknown, fallback = 'Произошла ошибка'): string {
  if (axios.isAxiosError(e)) {
    return (e.response?.data as ApiErrorBody)?.message ?? fallback
  }
  if (e instanceof Error) return e.message
  return fallback
}

export function getApiFieldErrors(e: unknown): Record<string, string> {
  if (!axios.isAxiosError(e)) return {}
  const body = e.response?.data as ApiErrorBody | undefined
  if (!body?.errors) return {}
  return Object.fromEntries(
    Object.entries(body.errors).map(([field, msgs]) => [field, msgs[0]])
  )
}

export function getApiStatus(e: unknown): number | undefined {
  if (axios.isAxiosError(e)) return e.response?.status
  return undefined
}
