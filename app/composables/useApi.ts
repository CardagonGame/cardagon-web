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

export interface PlayerInfo {
  user_id: string
  username: string
  role: 'host' | 'player'
  online: boolean
}

export interface WsPlayerInfo extends PlayerInfo {
  ping_ms: number | null
}

export interface GameState {
  started: boolean
  field_size: number
}

export interface GameResponse {
  game_id: string
  join_code: string
  your_role: 'host' | 'player'
  name: string
  players: PlayerInfo[]
}

export interface GamePublic {
  game_id: string
  join_code: string
  your_role: 'host' | 'player'
  date_created: string
  name: string
  started: boolean
  current_turn: number
}

interface UserGamesResponse {
  hosted: GamePublic[]
  joined: GamePublic[]
}

export const useApi = () => {
  const { token } = useAuth()

  const $api = $fetch.create({
    baseURL: '',
    onRequest({ options }) {
      if (token.value) {
        const headers = new Headers(options.headers as HeadersInit)
        headers.set('Authorization', `Bearer ${token.value}`)
        options.headers = headers
      }
    },
  })

  return {
    login: (email: string, password: string) => {
      const body = new FormData()
      body.append('username', email)
      body.append('password', password)
      return $api<LoginResponse>('/api/v1/login', { method: 'POST', body })
    },

    register: (
      username: string,
      email: string,
      password: string,
      inviteToken: string,
    ) =>
      $api<RegisterResponse>('/api/v1/register', {
        method: 'POST',
        body: { username, email, password, invite_token: inviteToken },
      }),

    getMe: () => $api<UserResponse>('/api/v1/me'),

    createGame: () =>
      $api<GameResponse>('/api/v1/game/create', { method: 'POST' }),

    joinGame: (joinCode: string) =>
      $api<GameResponse>(`/api/v1/game/join/${joinCode}`, { method: 'POST' }),

    getGameInfo: (gameId: string) =>
      $api<GameResponse>(`/api/v1/game/${gameId}/basic-info`),

    listGames: () => $api<UserGamesResponse>('/api/v1/games'),

    deleteGame: (gameId: string) =>
      $api(`/api/v1/game/${gameId}`, { method: 'DELETE' }),

    leaveGame: (gameId: string) =>
      $api(`/api/v1/game/${gameId}/leave`, { method: 'DELETE' }),
  }
}
