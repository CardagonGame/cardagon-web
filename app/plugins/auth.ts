export default defineNuxtPlugin({
  name: 'auth',
  enforce: 'pre',
  async setup() {
    const { token, setUser, logout } = useAuth()
    if (!token.value) return

    try {
      const user = await $fetch<{ id: string; username: string; email: string }>(
        '/api/v1/me',
        { headers: { Authorization: `Bearer ${token.value}` } },
      )
      setUser(user)
    }
    catch {
      logout()
    }
  },
})
