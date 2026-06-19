<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" @click.self="emit('cancel')">
      <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
        <p v-if="description" class="text-sm text-gray-500 mb-6">{{ description }}</p>
        <div class="flex gap-3 justify-end">
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            :disabled="loading"
            @click="emit('cancel')"
          >
            {{ cancelLabel ?? 'Отмена' }}
          </button>
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            :disabled="loading"
            @click="emit('confirm')"
          >
            {{ loading ? 'Удаление...' : (confirmLabel ?? 'Удалить') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
