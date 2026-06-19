<script setup lang="ts">
defineProps<{ count?: number }>()
</script>

<template>
  <div v-for="i in (count ?? 1)" :key="i" class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse">
    <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div class="h-3 bg-gray-100 rounded w-1/3 mb-4"></div>
    <div class="flex gap-3">
      <div class="h-3 bg-gray-100 rounded w-1/4"></div>
      <div class="h-3 bg-gray-100 rounded w-1/4"></div>
      <div class="h-3 bg-gray-100 rounded w-1/4"></div>
    </div>
  </div>
</template>
