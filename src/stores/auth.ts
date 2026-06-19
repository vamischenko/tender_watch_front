import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authApi } from '@/api/auth'
import { setAuthToken } from '@/api/http'
import type { LoginRequest } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(sessionStorage.getItem('tw_token'))
  const isAuthenticated = computed(() => !!token.value)

  if (token.value) {
    setAuthToken(token.value)
  }

  async function login(data: LoginRequest) {
    const res = await authApi.login(data)
    token.value = res.data.token
    setAuthToken(res.data.token)
    sessionStorage.setItem('tw_token', res.data.token)
  }

  function logout() {
    token.value = null
    setAuthToken(null)
    sessionStorage.removeItem('tw_token')
  }

  function restoreSession() {
    const saved = sessionStorage.getItem('tw_token')
    if (saved) {
      token.value = saved
      setAuthToken(saved)
    }
  }

  return { token, isAuthenticated, login, logout, restoreSession }
})
