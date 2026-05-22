<template>
  <v-container class="mt-8" max-width="500">
    <v-progress-circular v-if="pending && !game" indeterminate color="primary" />
    <v-card v-if="game">
      <div class="px-4 pt-4 pb-3">
        <div class="d-flex align-center mb-3">
          <v-card-title class="pa-0">{{ game.name }}</v-card-title>
          <v-spacer />
          <v-btn
            v-if="game.your_role === 'host'"
            prepend-icon="mdi-delete-outline"
            size="small"
            variant="tonal"
            color="error"
            :loading="deleting"
            @click="deleteGame"
          >{{ t('game.delete') }}</v-btn>
          <v-btn
            v-if="game.your_role !== 'host'"
            prepend-icon="mdi-exit-to-app"
            size="small"
            variant="tonal"
            color="error"
            :loading="leaving"
            @click="leaveGame"
          >{{ t('game.leave') }}</v-btn>
        </div>
        <v-chip :color="game.your_role === 'host' ? 'primary' : 'secondary'" class="mb-3">
          {{ t(`game.role.${game.your_role}`) }}
        </v-chip>
        <div class="d-flex flex-column ga-2">
          <div class="d-flex align-center ga-1">
            <span class="text-medium-emphasis text-body-2 mr-1">{{ t('game.joinCode') }}:</span>
            <code class="bg-surface-variant rounded px-2 py-1" style="font-size: 0.74rem">{{ game.join_code }}</code>
            <v-btn
              :icon="copiedCode ? 'mdi-check' : 'mdi-content-copy'"
              size="x-small"
              variant="text"
              :color="copiedCode ? 'success' : undefined"
              :title="t('game.copyJoinCode')"
              @click="copyCode(game!.join_code)"
            />
          </div>
          <div class="d-flex align-center ga-1">
            <span class="text-medium-emphasis text-body-2 mr-1">{{ t('game.joinUrl') }}:</span>
            <code class="bg-surface-variant rounded px-2 py-1" style="font-size: 0.74rem">{{ joinUrl }}</code>
            <v-btn
              :icon="copiedUrl ? 'mdi-check' : 'mdi-content-copy'"
              size="x-small"
              variant="text"
              :color="copiedUrl ? 'success' : undefined"
              :title="t('game.copyJoinUrl')"
              @click="copyUrl(joinUrl)"
            />
          </div>
        </div>
      </div>

      <v-divider />

      <v-banner
        v-if="wsStatus !== 'OPEN'"
        color="warning"
        density="compact"
        class="text-body-2"
        :text="wsStatus === 'CONNECTING' ? t('game.reconnecting') : t('game.disconnected')"
        icon="mdi-wifi-off"
      />

      <v-card-actions v-if="game.your_role === 'host' && !gameStarted" class="px-4 pt-3 pb-2 d-flex flex-column align-stretch ga-2">
        <v-btn
          block
          color="primary"
          variant="flat"
          prepend-icon="mdi-play"
          :disabled="wsStatus !== 'OPEN' || players.length < 2"
          @click="startGame"
        >{{ t('game.start') }}</v-btn>
        <p v-if="players.length < 2" class="text-body-2 text-medium-emphasis text-center ma-0">
          {{ t('game.notEnoughPlayers') }}
        </p>
      </v-card-actions>

      <v-divider v-if="game.your_role === 'host' && !gameStarted" />

      <v-list-subheader class="px-4">{{ t('game.players') }}</v-list-subheader>
      <v-list lines="one" class="pa-0 pb-2">
        <v-list-item
          v-for="player in players"
          :key="player.user_id"
          :title="player.username"
          class="px-4"
        >
          <template #prepend>
            <v-icon
              :color="player.online ? 'success' : 'surface-variant'"
              size="x-small"
              icon="mdi-circle"
              class="mr-2"
            />
          </template>
          <template #append>
            <span v-if="player.ping_ms !== null" class="text-body-2 text-medium-emphasis mr-2">
              {{ player.ping_ms }}ms
            </span>
            <v-chip
              :color="player.role === 'host' ? 'primary' : 'secondary'"
              size="small"
            >
              {{ t(`game.role.${player.role}`) }}
            </v-chip>
          </template>
        </v-list-item>
        <v-list-item v-if="!players.length" class="px-4">
          <v-list-item-title class="text-medium-emphasis">—</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { WsPlayerInfo } from '~/composables/useApi'

definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const route = useRoute()
const api = useApi()
const { token } = useAuth()
const { copy: copyCode, copied: copiedCode } = useClipboard()
const { copy: copyUrl, copied: copiedUrl } = useClipboard()
const requestUrl = useRequestURL()
const joinUrl = computed(() => `${requestUrl.origin}/join/${game.value!.join_code}`)
const { confirm } = useConfirm()

const gameId = route.params.gameId as string

const { data: game, pending } = await useAsyncData(
  `game-${gameId}`,
  () => api.getGameInfo(gameId),
)

watch(pending, (isPending, wasPending) => {
  if (wasPending && !isPending && !game.value) {
    toast.error(t('errors.gameLoadFailed'))
  }
})

const players = ref<WsPlayerInfo[]>(
  (game.value?.players ?? []).map(p => ({ ...p, ping_ms: null })),
)
const gameStarted = ref(false)
const deleting = ref(false)
const leaving = ref(false)
const isMounted = ref(false)

async function leaveGame() {
  const confirmed = await confirm({
    title: `Leave "${game.value!.name}"?`,
    message: 'You can rejoin later with the join code.',
    confirmText: 'Leave',
    color: 'error',
  })
  if (!confirmed) return

  leaving.value = true
  try {
    await api.leaveGame(gameId)
    navigateTo('/')
  } catch {
    toast.error(t('errors.leaveGameFailed'))
  } finally {
    leaving.value = false
  }
}

async function deleteGame() {
  const confirmed = await confirm({
    title: `Delete "${game.value!.name}"?`,
    message: 'This cannot be undone.',
    confirmText: 'Delete',
    color: 'error',
  })
  if (!confirmed) return

  deleting.value = true
  try {
    await api.deleteGame(gameId)
    navigateTo('/')
  } catch {
    toast.error(t('errors.deleteGameFailed'))
  } finally {
    deleting.value = false
  }
}

onMounted(() => { isMounted.value = true })

const wsUrl = computed(() => {
  if (!isMounted.value) return undefined
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = import.meta.dev ? 'localhost:8000' : window.location.host
  return `${proto}//${host}/api/v1/game/${gameId}/ws?token=${token.value}`
})

let pingAt: number | null = null

function sendPing() {
  pingAt = Date.now()
  send('{"type":"ping"}')
}

const { data: wsData, status: wsStatus, send } = useWebSocket(wsUrl, {
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

watch(wsData, (msg) => {
  if (!msg) return
  try {
    const parsed = JSON.parse(msg)
    if (parsed.type === 'pong' && pingAt !== null) {
      send(JSON.stringify({ type: 'ping_result', ms: Date.now() - pingAt }))
      pingAt = null
    }
    if (parsed.type === 'players') {
      players.value = parsed.players
      refreshNuxtData(`game-${gameId}`)
    }
    if (parsed.type === 'game_state') {
      gameStarted.value = parsed.started
    }
    if (parsed.type === 'game_start') {
      gameStarted.value = true
    }
  } catch {}
})
</script>
