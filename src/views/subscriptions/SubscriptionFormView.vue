<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useSubscriptionsStore } from '@/stores/subscriptions'
import { useTendersStore } from '@/stores/tenders'
import { useUiStore } from '@/stores/ui'
import { useDebounce } from '@/composables/useDebounce'
import { getApiFieldErrors, getApiMessage } from '@/api/errors'
import type { DeliveryChannel, FilterCriteria } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useSubscriptionsStore()
const tendersStore = useTendersStore()
const ui = useUiStore()

const isEdit = computed(() => !!route.params.id)
const subId = computed(() => route.params.id as string | undefined)

const name = ref('')
const categoryIds = ref<string[]>([])
const regions = ref<string[]>([])
const keywords = ref<string[]>([])
const minBudget = ref('')
const maxBudget = ref('')
const channels = ref<DeliveryChannel[]>(['email'])
const keywordInput = ref('')

const errors = ref<Record<string, string>>({})
const saving = ref(false)

onMounted(async () => {
  await tendersStore.fetchCategories()

  if (isEdit.value && subId.value) {
    if (!store.items.length) await store.fetchList()
    const sub = store.items.find((s) => s.id === subId.value)
    if (sub) {
      name.value = sub.name
      categoryIds.value = [...sub.criteria.category_ids]
      regions.value = [...sub.criteria.regions]
      keywords.value = [...sub.criteria.keywords]
      minBudget.value = sub.criteria.min_budget ? String(sub.criteria.min_budget / 100) : ''
      maxBudget.value = sub.criteria.max_budget ? String(sub.criteria.max_budget / 100) : ''
      channels.value = [...sub.channels] as DeliveryChannel[]
    }
  }
})

const criteria = computed<Partial<FilterCriteria>>(() => ({
  category_ids: categoryIds.value,
  regions: regions.value,
  keywords: keywords.value,
  min_budget: minBudget.value ? Number(minBudget.value) * 100 : null,
  max_budget: maxBudget.value ? Number(maxBudget.value) * 100 : null,
}))

const debouncedCriteria = useDebounce(criteria, 500)

watch(debouncedCriteria, (c) => {
  const hasAny = (c.category_ids?.length || c.regions?.length || c.keywords?.length || c.min_budget || c.max_budget)
  if (hasAny) store.fetchPreview(c)
})

function addKeyword() {
  const kw = keywordInput.value.trim().replace(/,/g, '')
  if (kw && !keywords.value.includes(kw)) {
    keywords.value.push(kw)
  }
  keywordInput.value = ''
}

function removeKeyword(kw: string) {
  keywords.value = keywords.value.filter((k) => k !== kw)
}

function addRegion(region: string) {
  const r = region.trim()
  if (r && !regions.value.includes(r)) regions.value.push(r)
}

function removeRegion(r: string) {
  regions.value = regions.value.filter((x) => x !== r)
}

const regionInput = ref('')

function validate(): boolean {
  errors.value = {}

  const hasCriteria =
    categoryIds.value.length ||
    regions.value.length ||
    keywords.value.length ||
    minBudget.value ||
    maxBudget.value

  if (!hasCriteria) {
    errors.value.criteria = 'Укажите хотя бы один критерий'
  }

  if (!channels.value.length) {
    errors.value.channels = 'Выберите хотя бы один канал доставки'
  }

  if (minBudget.value && maxBudget.value) {
    if (Number(minBudget.value) > Number(maxBudget.value)) {
      errors.value.budget = 'Минимальный бюджет не должен превышать максимальный'
    }
  }

  return !Object.keys(errors.value).length
}

async function submit() {
  if (!validate()) return
  saving.value = true
  try {
    const autoName = name.value.trim() ||
      [
        categoryIds.value.length ? 'Категории' : '',
        regions.value.join(', '),
        minBudget.value ? `от ${minBudget.value}₽` : '',
      ]
        .filter(Boolean)
        .join(', ') ||
      'Моя подписка'

    const payload = {
      name: autoName,
      criteria: {
        category_ids: categoryIds.value,
        regions: regions.value,
        keywords: keywords.value,
        min_budget: minBudget.value ? Number(minBudget.value) * 100 : null,
        max_budget: maxBudget.value ? Number(maxBudget.value) * 100 : null,
      },
      channels: channels.value,
    }

    if (isEdit.value && subId.value) {
      await store.update(subId.value, payload)
      ui.pushToast('Подписка обновлена', 'success')
    } else {
      await store.create(payload)
      ui.pushToast('Подписка создана', 'success')
    }
    router.push('/subscriptions')
  } catch (e: unknown) {
    const fieldErrors = getApiFieldErrors(e)
    if (Object.keys(fieldErrors).length) {
      errors.value = { ...errors.value, ...fieldErrors }
    } else {
      ui.pushToast(getApiMessage(e, 'Ошибка сохранения подписки'), 'error')
    }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <RouterLink to="/subscriptions" class="text-sm text-indigo-600 hover:text-indigo-800 mb-4 inline-flex items-center gap-1">
        ← Назад к подпискам
      </RouterLink>

      <h1 class="text-xl font-bold text-gray-900 mb-6 mt-2">
        {{ isEdit ? 'Редактировать подписку' : 'Новая подписка' }}
      </h1>

      <form class="space-y-6" @submit.prevent="submit">
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 class="text-sm font-semibold text-gray-700">Основное</h2>

          <div>
            <label class="label">Название подписки <span class="text-gray-400 font-normal">(необязательно)</span></label>
            <input v-model="name" type="text" class="input w-full" placeholder="Генерируется автоматически из критериев" />
          </div>

          <div>
            <label class="label">Категории</label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label
                v-for="cat in tendersStore.categories"
                :key="cat.id"
                class="flex items-center gap-2 text-sm cursor-pointer group"
              >
                <input
                  v-model="categoryIds"
                  type="checkbox"
                  :value="cat.id"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="text-gray-700 group-hover:text-gray-900">{{ cat.name }}</span>
              </label>
            </div>
          </div>

          <div>
            <label class="label">Регионы</label>
            <div class="flex gap-2 mb-2">
              <input
                v-model="regionInput"
                type="text"
                class="input flex-1"
                placeholder="Например: Москва"
                @keydown.enter.prevent="addRegion(regionInput); regionInput = ''"
              />
              <button
                type="button"
                class="btn-secondary"
                @click="addRegion(regionInput); regionInput = ''"
              >
                Добавить
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="r in regions"
                :key="r"
                class="tag"
              >
                {{ r }}
                <button type="button" class="ml-1 opacity-60 hover:opacity-100" @click="removeRegion(r)">✕</button>
              </span>
            </div>
          </div>

          <div>
            <label class="label">Ключевые слова</label>
            <div class="flex gap-2 mb-2">
              <input
                v-model="keywordInput"
                type="text"
                class="input flex-1"
                placeholder="Введите и нажмите Enter или запятую"
                @keydown.enter.prevent="addKeyword"
                @keydown="(e: KeyboardEvent) => { if (e.key === ',') { e.preventDefault(); addKeyword() } }"
              />
              <button type="button" class="btn-secondary" @click="addKeyword">Добавить</button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-for="kw in keywords" :key="kw" class="tag">
                {{ kw }}
                <button type="button" class="ml-1 opacity-60 hover:opacity-100" @click="removeKeyword(kw)">✕</button>
              </span>
            </div>
          </div>

          <div>
            <label class="label">Диапазон бюджета (₽)</label>
            <div class="flex gap-2">
              <input v-model="minBudget" type="number" class="input w-full" placeholder="От" min="0" />
              <input v-model="maxBudget" type="number" class="input w-full" placeholder="До" min="0" />
            </div>
            <p v-if="errors.budget" class="text-xs text-red-500 mt-1">{{ errors.budget }}</p>
          </div>

          <p v-if="errors.criteria" class="text-xs text-red-500">{{ errors.criteria }}</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h2 class="text-sm font-semibold text-gray-700">Каналы доставки</h2>

          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="channels"
              type="checkbox"
              value="email"
              class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span class="text-sm font-medium text-gray-700">📧 Email</span>
          </label>

          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="channels"
              type="checkbox"
              value="telegram"
              class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span class="text-sm font-medium text-gray-700">✈️ Telegram</span>
          </label>

          <p v-if="errors.channels" class="text-xs text-red-500">{{ errors.channels }}</p>
        </div>

        <div class="bg-indigo-50 rounded-xl border border-indigo-100 p-5">
          <h2 class="text-sm font-semibold text-indigo-700 mb-2">
            Предпросмотр
            <span v-if="store.isLoadingPreview" class="text-indigo-400 font-normal">(загрузка...)</span>
          </h2>

          <div v-if="store.preview">
            <p class="text-sm text-indigo-800">
              За последние 30 дней нашлось
              <strong>{{ store.preview.count }}</strong>
              {{ store.preview.count === 1 ? 'тендер' : store.preview.count < 5 ? 'тендера' : 'тендеров' }}
            </p>
            <ul v-if="store.preview.examples.length" class="mt-2 space-y-1">
              <li
                v-for="t in store.preview.examples.slice(0, 3)"
                :key="t.id"
                class="text-xs text-indigo-600 truncate"
              >
                • {{ t.title }}
              </li>
            </ul>
          </div>
          <p v-else class="text-xs text-indigo-400">Укажите критерии для предпросмотра</p>
        </div>

        <div class="flex gap-3">
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? 'Сохраняем...' : (isEdit ? 'Сохранить' : 'Создать подписку') }}
          </button>
          <RouterLink to="/subscriptions" class="btn-secondary">Отмена</RouterLink>
        </div>
      </form>
    </div>
  </AppLayout>
</template>
