import { useRouter, useRoute } from 'vue-router'
import type { TenderFilters } from '@/types'

const FILTER_KEYS = ['q', 'category', 'region', 'min_budget', 'max_budget', 'page', 'sort'] as const

export function useUrlFilters() {
  const router = useRouter()
  const route = useRoute()

  function readFiltersFromUrl(): TenderFilters {
    const q = route.query
    return {
      q: (q.q as string) || undefined,
      category: (q.category as string) || undefined,
      region: (q.region as string) || undefined,
      min_budget: q.min_budget ? Number(q.min_budget) : undefined,
      max_budget: q.max_budget ? Number(q.max_budget) : undefined,
      page: q.page ? Number(q.page) : 1,
      per_page: 20,
      sort: (q.sort as TenderFilters['sort']) || 'deadline',
    }
  }

  function writeFiltersToUrl(filters: TenderFilters) {
    // Берём все текущие query-параметры, удаляем только фильтровые ключи,
    // затем пишем актуальные — остальные (например redirect) не трогаем
    const base = { ...route.query }
    for (const key of FILTER_KEYS) delete base[key]

    const patch: Record<string, string> = {}
    if (filters.q) patch.q = filters.q
    if (filters.category) patch.category = filters.category
    if (filters.region) patch.region = filters.region
    if (filters.min_budget) patch.min_budget = String(filters.min_budget)
    if (filters.max_budget) patch.max_budget = String(filters.max_budget)
    if (filters.page && filters.page > 1) patch.page = String(filters.page)
    if (filters.sort && filters.sort !== 'deadline') patch.sort = filters.sort

    router.replace({ query: { ...base, ...patch } })
  }

  return { readFiltersFromUrl, writeFiltersToUrl }
}
