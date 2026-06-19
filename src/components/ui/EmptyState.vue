<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  action?: string
}>()

const emit = defineEmits<{ action: [] }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <div class="text-5xl mb-4">
      <slot name="icon">📭</slot>
    </div>
    <h3 class="text-lg font-semibold text-gray-700 mb-1">{{ title ?? 'Ничего не найдено' }}</h3>
    <p v-if="description" class="text-sm text-gray-500 mb-4">{{ description }}</p>
    <button
      v-if="action"
      class="btn-primary"
      @click="emit('action')"
    >
      {{ action }}
    </button>
  </div>
</template>
