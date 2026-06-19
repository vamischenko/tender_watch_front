import { defineStore } from 'pinia'
import { ref } from 'vue'
import { notificationsApi } from '@/api/notifications'
import type { NotificationFilters, NotificationLog, PaginationMeta } from '@/types'

export const useNotificationsStore = defineStore('notifications', () => {
  const items = ref<NotificationLog[]>([])
  const filters = ref<NotificationFilters>({ status: 'all', page: 1, per_page: 20 })
  const pagination = ref<PaginationMeta | null>(null)
  const isLoading = ref(false)

  async function fetchList() {
    isLoading.value = true
    try {
      const res = await notificationsApi.list(filters.value)
      items.value = res.data
      pagination.value = res.meta
    } finally {
      isLoading.value = false
    }
  }

  function setFilter(update: Partial<NotificationFilters>) {
    filters.value = { ...filters.value, ...update, page: 1 }
  }

  function setPage(page: number) {
    filters.value = { ...filters.value, page }
  }

  return { items, filters, pagination, isLoading, fetchList, setFilter, setPage }
})
