<template>
  <v-container class="mt-8" max-width="500">
    <v-progress-circular
      v-if="pending && !game"
      indeterminate
      color="primary"
    />
    <v-card v-if="game">
      <GameSetupHeader :game="game" :join-url="joinUrl" />

      <v-divider />

      <v-banner
        v-if="wsStatus !== 'OPEN'"
        color="warning"
        density="compact"
        class="text-body-2"
        :text="
          wsStatus === 'CONNECTING'
            ? t('game.reconnecting')
            : t('game.disconnected')
        "
        icon="mdi-wifi-off"
      />

      <GameStartActions
        v-if="game.your_role === 'host' && !gameStarted"
        :ws-status="wsStatus"
        :player-count="players.length"
        @start="startGame"
      />

      <v-divider v-if="game.your_role === 'host' && !gameStarted" />

      <GamePlayerList :players="players" />
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'

definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const api = useApi()
const requestUrl = useRequestURL()
const joinUrl = computed(
  () => `${requestUrl.origin}/join/${game.value!.join_code}`,
)

const gameId = route.params.gameId as string

const { data: game, pending } = await useAsyncData(`game-${gameId}`, () =>
  api.getGameInfo(gameId),
)

watch(pending, (isPending, wasPending) => {
  if (wasPending && !isPending && !game.value) {
    toast.error(t('errors.gameLoadFailed'))
  }
})

const { gameState, players, startGame, wsStatus } = useGameConnection(game)

const gameStarted = computed(() => Boolean(gameState.value.started))

watchImmediate(gameStarted, (newValue) => {
  if (newValue) {
    router.push(`/game/${gameId}`)
  }
})
</script>
