<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import { useNotificationsStore } from '@/stores/notifications'
import { useSubscriptionsStore } from '@/stores/subscriptions'
import { useRelativeTime } from '@/composables/useRelativeTime'
import type { NotificationLog } from '@/types'

const store = useNotificationsStore()
const subsStore = useSubscriptionsStore()
const { formatDateTime } = useRelativeTime()

const expandedErrors = ref<Set<string>>(new Set())

onMounted(async () => {
  await Promise.all([store.fetchList(), subsStore.fetchList()])
})

function toggleError(id: string) {
  if (expandedErrors.value.has(id)) {
    expandedErrors.value.delete(id)
  } else {
    expandedErrors.value.add(id)
  }
}

function channelLabel(n: NotificationLog) {
  return n.channel === 'email' ? '📧 Email' : '✈️ Telegram'
}

async function applyFilter(field: string, value: string) {
  if (field === 'status') {
    store.setFilter({ status: value as typeof store.filters.status })
  } else if (field === 'subscription_id') {
    store.setFilter({ subscription_id: value || undefined })
  }
  await store.fetchList()
}
</script>

<template>
  <AppLayout>
    <div class="max-w-3xl mx-auto">
      <h1 class="text-xl font-bold text-gray-900 mb-6">Лог уведомлений</h1>

      <div class="flex flex-wrap gap-3 mb-6">
        <select
          class="input"
          :value="store.filters.status ?? 'all'"
          @change="applyFilter('status', ($event.target as HTMLSelectElement).value)"
        >
          <option value="all">Все статусы</option>
          <option value="sent">Успешно</option>
          <option value="failed">Ошибка</option>
        </select>

        <select
          class="input"
          :value="store.filters.subscription_id ?? ''"
          @change="applyFilter('subscription_id', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">Все подписки</option>
          <option v-for="sub in subsStore.items" :key="sub.id" :value="sub.id">
            {{ sub.name }}
          </option>
        </select>
      </div>

      <div v-if="store.isLoading" class="space-y-3">
        <SkeletonCard :count="5" />
      </div>

      <EmptyState
        v-else-if="!store.items.length"
        title="Нет уведомлений"
        description="Уведомления появятся, когда тендеры совпадут с вашими подписками"
      >
        <template #icon>🔕</template>
      </EmptyState>

      <div v-else class="space-y-2">
        <div
          v-for="log in store.items"
          :key="log.id"
          class="bg-white rounded-xl border shadow-sm p-4"
          :class="log.status === 'failed' ? 'border-red-100' : 'border-gray-100'"
        >
          <div class="flex items-start gap-3">
            <div
              class="shrink-0 mt-1.5 w-2 h-2 rounded-full"
              :class="log.status === 'sent' ? 'bg-green-500' : 'bg-red-400'"
            />

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <RouterLink
                  :to="`/tenders/${log.tender_id}`"
                  class="text-sm font-medium text-gray-900 hover:text-indigo-600 truncate max-w-xs"
                >
                  {{ log.tender_title }}
                </RouterLink>
                <span class="text-xs text-gray-400">{{ channelLabel(log) }}</span>
                <span
                  class="text-xs px-2 py-0.5 rounded-full font-medium"
                  :class="log.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
                >
                  {{ log.status === 'sent' ? 'Отправлено' : 'Ошибка' }}
                </span>
              </div>

              <p class="text-xs text-gray-500 mb-1">
                Подписка:
                <RouterLink
                  :to="`/subscriptions/${log.subscription_id}/edit`"
                  class="text-indigo-500 hover:text-indigo-700"
                >
                  {{ log.subscription_name }}
                </RouterLink>
              </p>

              <p class="text-xs text-gray-400">{{ formatDateTime(log.sent_at) }}</p>

              <div v-if="log.status === 'failed' && log.error_message" class="mt-2">
                <button
                  class="text-xs text-red-500 hover:text-red-700 underline"
                  @click="toggleError(log.id)"
                >
                  {{ expandedErrors.has(log.id) ? 'Скрыть детали' : 'Показать ошибку' }}
                </button>
                <div v-if="expandedErrors.has(log.id)" class="mt-1 text-xs bg-red-50 rounded p-2 text-red-700 font-mono">
                  {{ log.error_message }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppPagination
        v-if="store.pagination && store.pagination.total_pages > 1"
        :meta="store.pagination"
        @change="store.setPage($event); store.fetchList()"
      />
    </div>
  </AppLayout>
</template>
