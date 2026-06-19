<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex items-center h-14 gap-6">
        <RouterLink to="/" class="font-bold text-indigo-600 text-lg tracking-tight shrink-0">
          TenderWatch
        </RouterLink>

        <div class="flex items-center gap-1 flex-1">
          <RouterLink
            to="/"
            class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            :class="$route.path === '/' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
          >
            Тендеры
          </RouterLink>
          <template v-if="auth.isAuthenticated">
            <RouterLink
              to="/subscriptions"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="$route.path.startsWith('/subscriptions') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
            >
              Подписки
            </RouterLink>
            <RouterLink
              to="/notifications"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="$route.path === '/notifications' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
            >
              Уведомления
            </RouterLink>
          </template>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <template v-if="auth.isAuthenticated">
            <span class="text-xs text-gray-400 hidden sm:block">Вы вошли</span>
            <button
              class="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              @click="logout"
            >
              Выйти
            </button>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              class="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Войти
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

