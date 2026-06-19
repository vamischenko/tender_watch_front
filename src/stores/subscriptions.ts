import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { subscriptionsApi } from '@/api/subscriptions'
import type {
  CreateSubscriptionRequest,
  FilterCriteria,
  Subscription,
  SubscriptionPreview,
  UpdateSubscriptionRequest,
} from '@/types'

export const useSubscriptionsStore = defineStore('subscriptions', () => {
  const items = ref<Subscription[]>([])
  const isLoading = ref(false)
  const preview = ref<SubscriptionPreview | null>(null)
  const isLoadingPreview = ref(false)

  let previewAbortController: AbortController | null = null

  async function fetchList() {
    isLoading.value = true
    try {
      const res = await subscriptionsApi.list()
      items.value = res.data
    } finally {
      isLoading.value = false
    }
  }

  async function create(data: CreateSubscriptionRequest) {
    const res = await subscriptionsApi.create(data)
    items.value.unshift(res.data)
    return res.data
  }

  async function update(id: string, data: UpdateSubscriptionRequest) {
    const res = await subscriptionsApi.update(id, data)
    const idx = items.value.findIndex((s) => s.id === id)
    if (idx !== -1) items.value[idx] = res.data
    return res.data
  }

  async function remove(id: string) {
    const removed = items.value.find((s) => s.id === id)
    const idx = items.value.findIndex((s) => s.id === id)
    items.value = items.value.filter((s) => s.id !== id)
    try {
      await subscriptionsApi.remove(id)
    } catch (e) {
      // Rollback оптимистичного удаления
      if (removed !== undefined && idx !== -1) {
        items.value.splice(idx, 0, removed)
      }
      throw e
    }
  }

  async function toggleActive(id: string) {
    const sub = items.value.find((s) => s.id === id)
    if (!sub) return
    const newActive = !sub.is_active
    sub.is_active = newActive
    try {
      await subscriptionsApi.update(id, { is_active: newActive })
    } catch {
      sub.is_active = !newActive
    }
  }

  async function fetchPreview(criteria: Partial<FilterCriteria>) {
    // Отменяем предыдущий запрос
    previewAbortController?.abort()
    previewAbortController = new AbortController()

    isLoadingPreview.value = true
    preview.value = null
    try {
      const res = await subscriptionsApi.preview(criteria, previewAbortController.signal)
      preview.value = res.data
    } catch (e) {
      if (!axios.isCancel(e)) throw e
      // Запрос был отменён — не сбрасываем isLoadingPreview, придёт новый
      return
    } finally {
      isLoadingPreview.value = false
    }
  }

  return { items, isLoading, preview, isLoadingPreview, fetchList, create, update, remove, toggleActive, fetchPreview }
})
