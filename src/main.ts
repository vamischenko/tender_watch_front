import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './main.css'
import { setUnauthorizedHandler, setErrorHandler } from './api/http'
import { useUiStore } from './stores/ui'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const ui = useUiStore()
const auth = useAuthStore()

setUnauthorizedHandler(() => {
  auth.logout()
  router.push('/login')
})

setErrorHandler((msg) => {
  ui.pushToast(msg, 'error')
})

app.mount('#app')
