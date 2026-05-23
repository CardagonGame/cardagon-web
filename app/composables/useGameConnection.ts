import { toast } from 'vue-sonner'

export const useGameConnection = (
  game: MaybeRefOrGetter<GameResponse | undefined>,
) => {
  const { token } = useAuth()

  const wsUrl = computed(() => {
    if (!toValue(game)) return
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = import.meta.dev
      ? `${window.location.hostname}:8000`
      : window.location.host
    return `${proto}//${host}/api/v1/game/${toValue(game)?.game_id}/ws?token=${token.value}`
  })

  const {
    data: wsData,
    status: wsStatus,
    send,
  } = useWebSocket(wsUrl, {
    autoReconnect: {
      retries: -1,
      delay: 2000,
    },
    onConnected: sendPing,
  })

  useIntervalFn(() => {
    if (wsStatus.value === 'OPEN') sendPing()
  }, 15_000)

  function startGame() {
    send(JSON.stringify({ type: 'game_start' }))
  }

  let pingAt: number | null = null

  function sendPing() {
    pingAt = Date.now()
    send('{"type":"ping"}')
  }

  watch(wsData, (msg) => {
    if (!msg) return
    try {
      const parsed = JSON.parse(msg)
      if (parsed.type === 'pong' && pingAt !== null) {
        send(JSON.stringify({ type: 'ping_result', ms: Date.now() - pingAt }))
        pingAt = null
      }
      console.log(parsed)
      if (parsed.type === 'players') {
        players.value = parsed.players
        if (players.value.length !== parsed.players.length) {
          refreshNuxtData(`game-${toValue(game)?.game_id}`)
        }
      }
      if (parsed.type === 'game_state') {
        gameState.value = parsed
      }
      if (parsed.type === 'game_start') {
        gameState.value.started = true
      }
      if (parsed.type === 'error') {
        toast.error(parsed.message)
      }
    } catch {}
  })

  const players = ref<WsPlayerInfo[]>(
    (toValue(game)?.players ?? []).map((p) => ({ ...p, ping_ms: null })),
  )
  const gameState = ref<Partial<GameState>>({})

  return {
    gameState,
    players,
    startGame,
    wsStatus,
  }
}
