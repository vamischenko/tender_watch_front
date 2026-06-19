<script setup lang="ts">
import type { PaginationMeta } from '@/types'

defineProps<{ meta: PaginationMeta }>()
const emit = defineEmits<{ change: [page: number] }>()

function pages(meta: PaginationMeta): number[] {
  const total = meta.total_pages
  const cur = meta.page
  const range: number[] = []
  const delta = 2
  for (let i = Math.max(1, cur - delta); i <= Math.min(total, cur + delta); i++) {
    range.push(i)
  }
  return range
}
</script>

<template>
  <div class="flex items-center gap-1 justify-center mt-6">
    <button
      class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
      :class="meta.page > 1 ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-300 cursor-not-allowed'"
      :disabled="meta.page <= 1"
      @click="emit('change', meta.page - 1)"
    >
      ←
    </button>

    <button
      v-if="pages(meta)[0] > 1"
      class="px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100 text-gray-700"
      @click="emit('change', 1)"
    >
      1
    </button>
    <span v-if="pages(meta)[0] > 2" class="text-gray-400 px-1">…</span>

    <button
      v-for="p in pages(meta)"
      :key="p"
      class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
      :class="p === meta.page ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100 text-gray-700'"
      @click="emit('change', p)"
    >
      {{ p }}
    </button>

    <span v-if="pages(meta).at(-1)! < meta.total_pages - 1" class="text-gray-400 px-1">…</span>
    <button
      v-if="pages(meta).at(-1)! < meta.total_pages"
      class="px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100 text-gray-700"
      @click="emit('change', meta.total_pages)"
    >
      {{ meta.total_pages }}
    </button>

    <button
      class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
      :class="meta.page < meta.total_pages ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-300 cursor-not-allowed'"
      :disabled="meta.page >= meta.total_pages"
      @click="emit('change', meta.page + 1)"
    >
      →
    </button>
  </div>
</template>
