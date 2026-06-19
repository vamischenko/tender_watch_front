import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/tenders/TenderListView.vue'),
    },
    {
      path: '/tenders/:id',
      component: () => import('@/views/tenders/TenderDetailView.vue'),
    },
    {
      path: '/login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/subscriptions',
      component: () => import('@/views/subscriptions/SubscriptionListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/subscriptions/new',
      component: () => import('@/views/subscriptions/SubscriptionFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/subscriptions/:id/edit',
      component: () => import('@/views/subscriptions/SubscriptionFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/notifications',
      component: () => import('@/views/NotificationsView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

export default router
