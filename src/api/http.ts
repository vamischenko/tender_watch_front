import axios, { type AxiosInstance } from 'axios'

let authToken: string | null = null
let onUnauthorized: (() => void) | null = null
let onError: ((msg: string) => void) | null = null

export function setAuthToken(token: string | null) {
  authToken = token
}

export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn
}

export function setErrorHandler(fn: (msg: string) => void) {
  onError = fn
}

const http: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  (error) => {
    // Отменённые запросы (AbortController) не показываем пользователю
    if (axios.isCancel(error)) return Promise.reject(error)

    const status = error.response?.status

    if (status === 401) {
      onUnauthorized?.()
    } else if (status === 403) {
      onError?.('Доступ запрещён')
    } else if (status === 429) {
      const retryAfter = error.response?.headers['retry-after']
      const msg = retryAfter
        ? `Слишком много запросов, повторите через ${retryAfter} сек.`
        : 'Слишком много запросов, попробуйте позже'
      onError?.(msg)
    } else if (status >= 500 || !error.response) {
      onError?.(error.response?.data?.message ?? 'Ошибка сервера, попробуйте позже')
    }

    return Promise.reject(error)
  },
)

export default http
