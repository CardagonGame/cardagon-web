interface User {
  id: string
  username: string
  email: string
}

export const useAuth = () => {
  const tokenCookie = useCookie<string | null>('auth_token', {
    default: () => null,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
  })

  // useState ensures all useAuth() callers share the same ref instance
  const token = useState<string | null>('auth_token', () => tokenCookie.value)
  const user = useState<User | null>('auth_user', () => null)
  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
    tokenCookie.value = newToken
  }
  function setUser(newUser: User) {
    user.value = newUser
  }
  function logout() {
    token.value = null
    tokenCookie.value = null
    user.value = null
  }

  return { token, user, isAuthenticated, setToken, setUser, logout }
}
