import { defineStore } from 'pinia'

interface AuthUser {
  id: number
  email: string
  name: string
  role: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    setUser(user: AuthUser) {
      this.user = user
    },
    clearUser() {
      this.user = null
    },
    async fetchMe() {
      try {
        const user = await $fetch<AuthUser>('/api/auth/me')
        this.user = user
        return user
      } catch {
        this.user = null
        return null
      }
    },
  },
})
