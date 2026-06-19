<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import TenderCard from '@/components/tenders/TenderCard.vue'
import TenderFilters from '@/components/tenders/TenderFilters.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
import { useTendersStore } from '@/stores/tenders'
import { useUrlFilters } from '@/composables/useUrlFilters'

const store = useTendersStore()
const { readFiltersFromUrl, writeFiltersToUrl } = useUrlFilters()

// Флаг, чтобы watch не запускал fetchList во время начальной установки фильтров из URL
const initializing = ref(true)

onMounted(async () => {
  await store.fetchCategories()
  const urlFilters = readFiltersFromUrl()
  store.filters = { ...store.filters, ...urlFilters }
  await store.fetchList()
  initializing.value = false
})

watch(
  () => store.filters,
  (f) => {
    if (initializing.value) return
    writeFiltersToUrl(f)
    store.fetchList()
  },
)

function handleFilterUpdate(filters: typeof store.filters) {
  store.filters = filters
}

function handleRetry() {
  store.fetchList()
}

function handleResetFilters() {
  store.resetFilters()
}
</script>

<template>
  <AppLayout>
    <div class="flex gap-6">
      <aside class="w-56 shrink-0 hidden lg:block">
        <TenderFilters
          :model-value="store.filters"
          :categories="store.categories"
          @update:model-value="handleFilterUpdate"
        />
      </aside>

      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-xl font-bold text-gray-900">Тендеры</h1>
          <span v-if="store.pagination" class="text-sm text-gray-400">
            {{ store.pagination.total }} результатов
          </span>
        </div>

        <div v-if="store.isLoading" class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard :count="6" />
        </div>

        <div v-else-if="store.error" class="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
          <p class="text-red-600 mb-3">{{ store.error }}</p>
          <button class="btn-primary" @click="handleRetry">Повторить</button>
        </div>

        <div v-else-if="!store.items.length">
          <EmptyState
            title="Ничего не найдено"
            description="Попробуйте изменить фильтры или сбросить их"
            action="Сбросить фильтры"
            @action="handleResetFilters"
          />
        </div>

        <div v-else class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <TenderCard
            v-for="tender in store.items"
            :key="tender.id"
            :tender="tender"
            :categories="store.categories"
          />
        </div>

        <AppPagination
          v-if="store.pagination && store.pagination.total_pages > 1"
          :meta="store.pagination"
          @change="(p) => { store.setPage(p); store.fetchList() }"
        />
      </div>
    </div>

    <!-- Mobile filters -->
    <div class="lg:hidden mt-4">
      <details class="bg-white rounded-xl border border-gray-100 shadow-sm">
        <summary class="px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer">Фильтры</summary>
        <div class="px-4 pb-4">
          <TenderFilters
            :model-value="store.filters"
            :categories="store.categories"
            @update:model-value="handleFilterUpdate"
          />
        </div>
      </details>
    </div>
  </AppLayout>
</template>
