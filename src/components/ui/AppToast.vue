<script setup lang="ts">
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
    <Transition
      v-for="toast in ui.toasts"
      :key="toast.id"
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0 translate-x-4"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 translate-x-4"
    >
      <div
        class="flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium"
        :class="{
          'bg-green-50 border border-green-200 text-green-800': toast.type === 'success',
          'bg-red-50 border border-red-200 text-red-800': toast.type === 'error',
          'bg-blue-50 border border-blue-200 text-blue-800': toast.type === 'info',
        }"
      >
        <span class="flex-1">{{ toast.message }}</span>
        <button
          class="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          @click="ui.dismissToast(toast.id)"
        >
          ✕
        </button>
      </div>
    </Transition>
  </div>
</template>
