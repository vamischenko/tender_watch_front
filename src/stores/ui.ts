import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Toast, ToastType } from '@/types'

export const useUiStore = defineStore('ui', () => {
  const toasts = ref<Toast[]>([])
  const globalError = ref<string | null>(null)

  function pushToast(message: string, type: ToastType = 'info') {
    const id = crypto.randomUUID()
    toasts.value.push({ id, type, message })
    if (type === 'success') {
      setTimeout(() => dismissToast(id), 4000)
    }
  }

  function dismissToast(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function setGlobalError(msg: string | null) {
    globalError.value = msg
  }

  return { toasts, globalError, pushToast, dismissToast, setGlobalError }
})
