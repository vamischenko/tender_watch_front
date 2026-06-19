<script setup lang="ts">
import type { Category, Tender } from '@/types'
import { useRelativeTime } from '@/composables/useRelativeTime'

const props = defineProps<{
  tender: Tender
  categories: Category[]
}>()

const { formatDeadline } = useRelativeTime()

function categoryName(id: string) {
  return props.categories.find((c) => c.id === id)?.name ?? '—'
}

function formatBudget(amount: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(
    amount / 100,
  )
}

const deadlineUrgency = (deadline: string) => {
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
  if (days < 0) return 'text-gray-400'
  if (days <= 3) return 'text-red-600 font-semibold'
  if (days <= 7) return 'text-orange-500 font-medium'
  return 'text-gray-500'
}
</script>

<template>
  <RouterLink
    :to="`/tenders/${tender.id}`"
    class="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all p-5 group"
  >
    <div class="flex items-start justify-between gap-3 mb-2">
      <h3 class="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 text-sm leading-snug">
        {{ tender.title }}
      </h3>
      <span
        class="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
        :class="tender.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
      >
        {{ tender.status === 'active' ? 'Активен' : 'Закрыт' }}
      </span>
    </div>

    <div class="text-xs text-indigo-600 font-medium mb-3">
      {{ categoryName(tender.category_id) }}
    </div>

    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
      <span class="font-semibold text-gray-700">{{ formatBudget(tender.budget.amount) }}</span>
      <span>{{ tender.region }}</span>
      <span :class="deadlineUrgency(tender.deadline_at)">
        {{ formatDeadline(tender.deadline_at) }}
      </span>
    </div>
  </RouterLink>
</template>
