<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { getApiMessage } from '@/api/errors'

const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Введите email и пароль'
    return
  }
  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    ui.pushToast('Добро пожаловать!', 'success')
    const redirect = (route.query.redirect as string) ?? '/'
    router.push(redirect)
  } catch (e: unknown) {
    error.value = getApiMessage(e, 'Неверный email или пароль')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-indigo-600">TenderWatch</h1>
        <p class="text-sm text-gray-500 mt-1">Войдите в аккаунт</p>
      </div>

      <form class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4" @submit.prevent="submit">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="user@example.com"
            class="input w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="••••••••"
            class="input w-full"
          />
        </div>

        <div v-if="error" class="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {{ error }}
        </div>

        <button
          type="submit"
          class="btn-primary w-full"
          :disabled="loading"
        >
          {{ loading ? 'Входим...' : 'Войти' }}
        </button>
      </form>
    </div>
  </div>
</template>
