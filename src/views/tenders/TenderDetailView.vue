<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import { useTendersStore } from '@/stores/tenders'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { getApiStatus } from '@/api/errors'
import { useRelativeTime } from '@/composables/useRelativeTime'

const route = useRoute()
const store = useTendersStore()
const auth = useAuthStore()
const ui = useUiStore()
const { formatDeadline, formatDate } = useRelativeTime()

const id = route.params.id as string
const fetchError = ref<string | null>(null)

onMounted(async () => {
  try {
    await Promise.all([store.fetchOne(id), store.fetchCategories()])
  } catch (e: unknown) {
    const status = getApiStatus(e)
    if (status === 404) {
      fetchError.value = 'Тендер не найден'
    } else {
      fetchError.value = 'Не удалось загрузить тендер'
      ui.pushToast('Не удалось загрузить тендер', 'error')
    }
  }
})

const tender = computed(() => store.current)

function formatBudget(amount: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount / 100)
}

function categoryName(catId: string) {
  return store.categories.find((c) => c.id === catId)?.name ?? '—'
}
</script>

<template>
  <AppLayout>
    <div class="max-w-3xl mx-auto">
      <RouterLink to="/" class="text-sm text-indigo-600 hover:text-indigo-800 mb-4 inline-flex items-center gap-1">
        ← Назад к списку
      </RouterLink>

      <div v-if="store.isLoadingOne" class="mt-4">
        <SkeletonCard :count="1" />
      </div>

      <div v-else-if="fetchError" class="mt-4 bg-red-50 border border-red-100 rounded-xl p-6 text-center">
        <p class="text-red-600 mb-3">{{ fetchError }}</p>
        <RouterLink to="/" class="btn-primary">← К списку тендеров</RouterLink>
      </div>

      <div v-else-if="!tender" class="text-center py-16 text-gray-400">
        Тендер не найден
      </div>

      <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-4 space-y-6">
        <div class="flex items-start justify-between gap-4">
          <h1 class="text-xl font-bold text-gray-900 leading-tight">{{ tender.title }}</h1>
          <span
            class="shrink-0 text-sm px-3 py-1 rounded-full font-medium"
            :class="tender.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
          >
            {{ tender.status === 'active' ? 'Активен' : 'Закрыт' }}
          </span>
        </div>

        <div class="flex flex-wrap gap-2">
          <span class="badge-indigo">{{ categoryName(tender.category_id) }}</span>
          <span class="badge-gray">{{ tender.region }}</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-gray-100">
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Бюджет</p>
            <p class="font-semibold text-gray-900">{{ formatBudget(tender.budget.amount) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Дедлайн</p>
            <p class="font-medium text-gray-900">{{ formatDate(tender.deadline_at) }}</p>
            <p class="text-xs" :class="tender.is_expired ? 'text-gray-400' : 'text-orange-500'">
              {{ formatDeadline(tender.deadline_at) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-400 mb-0.5">Опубликован</p>
            <p class="font-medium text-gray-900">{{ formatDate(tender.published_at) }}</p>
          </div>
        </div>

        <div>
          <h2 class="text-sm font-semibold text-gray-700 mb-2">Описание</h2>
          <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{{ tender.description }}</p>
        </div>

        <div v-if="auth.isAuthenticated" class="bg-indigo-50 rounded-xl p-4">
          <p class="text-sm font-medium text-indigo-700 mb-1">Подходит под ваши подписки</p>
          <p class="text-xs text-indigo-500">
            Перейдите в раздел
            <RouterLink to="/subscriptions" class="underline">«Подписки»</RouterLink>
            чтобы проверить совпадения
          </p>
        </div>

        <div v-else class="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
          <RouterLink to="/login" class="text-indigo-600 hover:underline">Войдите</RouterLink>,
          чтобы получать уведомления об этом и похожих тендерах
        </div>
      </div>
    </div>
  </AppLayout>
</template>
