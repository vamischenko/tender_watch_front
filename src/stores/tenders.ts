import { defineStore } from 'pinia'
import { ref } from 'vue'
import { tendersApi } from '@/api/tenders'
import type { Category, PaginationMeta, Tender, TenderFilters } from '@/types'

const DEFAULT_FILTERS: TenderFilters = {
  page: 1,
  per_page: 20,
  sort: 'deadline',
}

export const useTendersStore = defineStore('tenders', () => {
  const items = ref<Tender[]>([])
  const current = ref<Tender | null>(null)
  const categories = ref<Category[]>([])
  const filters = ref<TenderFilters>({ ...DEFAULT_FILTERS })
  const pagination = ref<PaginationMeta | null>(null)
  const isLoading = ref(false)
  const isLoadingOne = ref(false)
  const error = ref<string | null>(null)

  async function fetchList() {
    isLoading.value = true
    error.value = null
    try {
      const res = await tendersApi.list(filters.value)
      items.value = res.data
      pagination.value = res.meta
    } catch (e: unknown) {
      error.value = (e as Error).message ?? 'Ошибка загрузки'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchOne(id: string) {
    isLoadingOne.value = true
    current.value = null
    try {
      const res = await tendersApi.get(id)
      current.value = res.data
    } finally {
      isLoadingOne.value = false
    }
  }

  async function fetchCategories() {
    if (categories.value.length) return
    const res = await tendersApi.categories()
    categories.value = res.data
  }

  function setFilter(update: Partial<TenderFilters>) {
    filters.value = { ...filters.value, ...update, page: 1 }
  }

  function setPage(page: number) {
    filters.value = { ...filters.value, page }
  }

  function resetFilters() {
    filters.value = { ...DEFAULT_FILTERS }
  }

  return {
    items,
    current,
    categories,
    filters,
    pagination,
    isLoading,
    isLoadingOne,
    error,
    fetchList,
    fetchOne,
    fetchCategories,
    setFilter,
    setPage,
    resetFilters,
  }
})
