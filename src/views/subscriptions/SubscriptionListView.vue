<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { useSubscriptionsStore } from '@/stores/subscriptions'
import { useUiStore } from '@/stores/ui'
import type { Subscription } from '@/types'

const store = useSubscriptionsStore()
const ui = useUiStore()
const router = useRouter()

const toDelete = ref<Subscription | null>(null)
const deleting = ref(false)

onMounted(() => store.fetchList())

async function confirmDelete() {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await store.remove(toDelete.value.id)
    ui.pushToast('Подписка удалена', 'success')
    toDelete.value = null
  } catch {
    ui.pushToast('Не удалось удалить подписку', 'error')
  } finally {
    deleting.value = false
  }
}

async function toggleActive(sub: Subscription) {
  await store.toggleActive(sub.id)
}

function criteriaLabel(sub: Subscription) {
  const parts: string[] = []
  if (sub.criteria.regions?.length) parts.push(sub.criteria.regions.join(', '))
  if (sub.criteria.min_budget || sub.criteria.max_budget) {
    const min = sub.criteria.min_budget ? (sub.criteria.min_budget / 100).toLocaleString('ru-RU') : '0'
    const max = sub.criteria.max_budget ? (sub.criteria.max_budget / 100).toLocaleString('ru-RU') : '∞'
    parts.push(`${min}–${max} ₽`)
  }
  if (sub.criteria.keywords?.length) parts.push(sub.criteria.keywords.join(', '))
  return parts.join(' · ') || 'Без ограничений'
}
</script>

<template>
  <AppLayout>
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-bold text-gray-900">Мои подписки</h1>
        <RouterLink to="/subscriptions/new" class="btn-primary">+ Создать</RouterLink>
      </div>

      <div v-if="store.isLoading" class="space-y-3">
        <SkeletonCard :count="3" />
      </div>

      <EmptyState
        v-else-if="!store.items.length"
        title="Нет подписок"
        description="Создайте подписку, чтобы получать уведомления о тендерах по вашим критериям"
        action="Создать первую подписку"
        @action="router.push('/subscriptions/new')"
      >
        <template #icon>🔔</template>
      </EmptyState>

      <div v-else class="space-y-3">
        <div
          v-for="sub in store.items"
          :key="sub.id"
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
        >
          <div class="flex items-start gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-semibold text-gray-900 truncate">{{ sub.name }}</h3>
                <span
                  class="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
                  :class="sub.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'"
                >
                  {{ sub.is_active ? 'Активна' : 'Выключена' }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mb-2">{{ criteriaLabel(sub) }}</p>
              <div class="flex gap-2">
                <span
                  v-for="ch in sub.channels"
                  :key="ch"
                  class="text-xs px-2 py-0.5 rounded-full border border-indigo-100 text-indigo-600 bg-indigo-50"
                >
                  {{ ch === 'email' ? '📧 Email' : '✈️ Telegram' }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button
                class="relative inline-flex h-5 w-9 rounded-full transition-colors focus:outline-none"
                :class="sub.is_active ? 'bg-indigo-600' : 'bg-gray-200'"
                :title="sub.is_active ? 'Выключить' : 'Включить'"
                @click="toggleActive(sub)"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform mt-0.5 ml-0.5"
                  :class="sub.is_active ? 'translate-x-4' : 'translate-x-0'"
                />
              </button>

              <RouterLink
                :to="`/subscriptions/${sub.id}/edit`"
                class="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                title="Редактировать"
              >
                ✏️
              </RouterLink>

              <button
                class="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Удалить"
                @click="toDelete = sub"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConfirmModal
      v-if="toDelete"
      title="Удалить подписку?"
      :description="`Подписка «${toDelete.name}» будет удалена без возможности восстановления.`"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </AppLayout>
</template>
