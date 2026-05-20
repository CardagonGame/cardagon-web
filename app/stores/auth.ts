import { defineStore } from 'pinia'

interface User {
  id: string
  username: string
  email: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as User | null,
  }),
  getters: {
    isAuthenticated: (s) => !!s.token,
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUser(user: User) {
      this.user = user
    },
    logout() {
      this.token = null
      this.user = null
    },
  },
  persist: true,
})
