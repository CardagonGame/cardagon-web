interface LoginResponse {
  access_token: string
  token_type: string
}

interface UserResponse {
  id: string
  username: string
  email: string
}

interface RegisterResponse {
  id: string
  username: string
  email: string
}

interface GameResponse {
  game_id: string
  join_code: string
  your_role: 'host' | 'player'
}

export const useApi = () => {
  const auth = useAuthStore()

  const $api = $fetch.create({
    onRequest({ options }) {
      if (auth.token) {
        const headers = new Headers(options.headers as HeadersInit)
        headers.set('Authorization', `Bearer ${auth.token}`)
        options.headers = headers
      }
    },
  })

  return {
    login: (username: string, password: string) => {
      const body = new FormData()
      body.append('username', username)
      body.append('password', password)
      return $api<LoginResponse>('/api/v1/login', { method: 'POST', body })
    },

    register: (username: string, email: string, password: string, inviteToken: string) =>
      $api<RegisterResponse>('/api/v1/register', {
        method: 'POST',
        body: { username, email, password, invite_token: inviteToken },
      }),

    getMe: () => $api<UserResponse>('/api/v1/me'),

    createGame: () => $api<GameResponse>('/api/v1/game/create', { method: 'POST' }),

    joinGame: (joinCode: string) =>
      $api<GameResponse>(`/api/v1/game/join/${joinCode}`, { method: 'POST' }),

    getGameInfo: (gameId: string) =>
      $api<GameResponse>(`/api/v1/game/${gameId}/basic-info`),
  }
}
