<script setup lang="ts">
import AppNav from './AppNav.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AppNav />
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
      <slot />
    </main>
  </div>
</template>
