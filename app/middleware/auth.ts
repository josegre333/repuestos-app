import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return
  if (to.path === '/admin/login') return

  const authStore = useAuthStore()

  if (!authStore.isLoggedIn) {
    await authStore.fetchMe()
  }

  if (!authStore.isLoggedIn) {
    return navigateTo('/admin/login')
  }
})
