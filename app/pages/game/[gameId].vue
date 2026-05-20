<template>
  <v-container class="mt-8" max-width="500">
    <v-progress-circular v-if="pending" indeterminate color="primary" />
    <v-card v-else-if="game">
      <div class="px-4 pt-4 pb-3">
        <v-card-title class="mb-3">{{ game.name }}</v-card-title>
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

      <v-list-subheader class="px-4">{{ t('game.players') }}</v-list-subheader>
      <v-list lines="one" class="pa-0 pb-2">
        <v-list-item
          v-for="player in players"
          :key="player.user_id"
          :title="player.username"
          class="px-4"
        >
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

interface PlayerInfo {
  user_id: string
  username: string
  role: 'host' | 'player'
}

definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const route = useRoute()
const api = useApi()
const { token } = useAuth()
const { copy, copied } = useClipboard()

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

const players = ref<PlayerInfo[]>([])
const wsUrl = ref<string | undefined>(undefined)

onMounted(() => {
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  wsUrl.value = `${proto}//${window.location.host}/api/v1/game/${gameId}/ws?token=${token.value}`
})

const { data: wsData } = useWebSocket(wsUrl, { autoReconnect: true })

watch(wsData, (msg) => {
  if (!msg) return
  try {
    const parsed = JSON.parse(msg)
    if (parsed.type === 'players') players.value = parsed.players
  } catch {}
})
</script>
