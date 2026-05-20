interface User {
  id: string
  username: string
  email: string
}

export const useAuth = () => {
  const token = useCookie<string | null>('auth_token', {
    default: () => null,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
  })

  const user = useState<User | null>('auth_user', () => null)
  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
  }
  function setUser(newUser: User) {
    user.value = newUser
  }
  function logout() {
    token.value = null
    user.value = null
  }

  console.log(token.value, user.value)

  return { token, user, isAuthenticated, setToken, setUser, logout }
}
