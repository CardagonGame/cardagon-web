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
        </div>
        <div class="d-flex align-center ga-3">
          <v-chip :color="game.your_role === 'host' ? 'primary' : 'secondary'">
            {{ t(`game.role.${game.your_role}`) }}
          </v-chip>
          <span class="text-medium-emphasis text-body-2">{{ t('game.joinCode') }}: {{ game.join_code }}</span>
          <v-btn
            :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
            size="x-small"
            variant="text"
            :color="copied ? 'success' : undefined"
            :title="t('game.copyJoinCode')"
            @click="copy(game!.join_code)"
          />
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
import type { PlayerInfo } from '~/composables/useApi'

definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const route = useRoute()
const api = useApi()
const { token } = useAuth()
const { copy, copied } = useClipboard()
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

const players = ref<PlayerInfo[]>(game.value?.players ?? [])
const deleting = ref(false)
const isMounted = ref(false)

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

const { data: wsData, status: wsStatus } = useWebSocket(wsUrl, {
  autoReconnect: {
    retries: -1,
    delay: 2000,
  },
  heartbeat: {
    message: '{"type":"ping"}',
    interval: 30_000,
    pongTimeout: 5_000,
  },
})

watch(wsData, (msg) => {
  if (!msg) return
  try {
    const parsed = JSON.parse(msg)
    if (parsed.type === 'players') {
      players.value = parsed.players
      refreshNuxtData(`game-${gameId}`)
    }
  } catch {}
})
</script>
