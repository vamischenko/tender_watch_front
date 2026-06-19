<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Category, TenderFilters } from '@/types'
import { useDebounce } from '@/composables/useDebounce'

const props = defineProps<{
  modelValue: TenderFilters
  categories: Category[]
}>()

const emit = defineEmits<{ 'update:modelValue': [filters: TenderFilters] }>()

const q = ref(props.modelValue.q ?? '')
const category = ref(props.modelValue.category ?? '')
const region = ref(props.modelValue.region ?? '')
const minBudget = ref(props.modelValue.min_budget ? String(props.modelValue.min_budget / 100) : '')
const maxBudget = ref(props.modelValue.max_budget ? String(props.modelValue.max_budget / 100) : '')
const sort = ref(props.modelValue.sort ?? 'deadline')

const debouncedQ = useDebounce(q, 400)
const debouncedMin = useDebounce(minBudget, 400)
const debouncedMax = useDebounce(maxBudget, 400)
const debouncedRegion = useDebounce(region, 400)

function emitFilters() {
  emit('update:modelValue', {
    q: debouncedQ.value || undefined,
    category: category.value || undefined,
    region: debouncedRegion.value || undefined,
    min_budget: debouncedMin.value ? Number(debouncedMin.value) * 100 : undefined,
    max_budget: debouncedMax.value ? Number(debouncedMax.value) * 100 : undefined,
    sort: sort.value as TenderFilters['sort'],
    page: 1,
    per_page: 20,
  })
}

watch([debouncedQ, category, debouncedRegion, debouncedMin, debouncedMax, sort], emitFilters)

function reset() {
  q.value = ''
  category.value = ''
  region.value = ''
  minBudget.value = ''
  maxBudget.value = ''
  sort.value = 'deadline'
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
    <h2 class="text-sm font-semibold text-gray-700">Фильтры</h2>

    <div>
      <label class="label">Поиск</label>
      <input v-model="q" type="search" class="input w-full" placeholder="Ключевые слова..." />
    </div>

    <div>
      <label class="label">Категория</label>
      <select v-model="category" class="input w-full">
        <option value="">Все категории</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
    </div>

    <div>
      <label class="label">Регион</label>
      <input v-model="region" type="text" class="input w-full" placeholder="Например: Москва" />
    </div>

    <div>
      <label class="label">Бюджет (₽)</label>
      <div class="flex gap-2">
        <input v-model="minBudget" type="number" class="input w-full" placeholder="От" min="0" />
        <input v-model="maxBudget" type="number" class="input w-full" placeholder="До" min="0" />
      </div>
    </div>

    <div>
      <label class="label">Сортировка</label>
      <select v-model="sort" class="input w-full">
        <option value="deadline">По дедлайну</option>
        <option value="budget">По бюджету</option>
        <option value="published">По дате публикации</option>
      </select>
    </div>

    <button class="text-xs text-indigo-600 hover:text-indigo-800 transition-colors" @click="reset">
      Сбросить фильтры
    </button>
  </div>
</template>
