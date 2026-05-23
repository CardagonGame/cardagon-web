<template>
  <div class="game-board">
    <PanZoomCanvas>
      <GameHexGrid v-if="gameState.field_size" :radius="gameState.field_size" />
      <v-progress-circular v-else indeterminate color="primary" />
    </PanZoomCanvas>

    <v-fab
      icon="mdi-account-group"
      location="bottom end"
      class="player-list-fab"
      @click="playerListOpen = true"
    />

    <v-dialog v-model="playerListOpen" max-width="400">
      <v-card>
        <GamePlayerList :players="players" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const api = useApi()
const { t } = useI18n()

const gameId = route.params.gameId as string

const { data: game, error } = await useAsyncData(`game-${gameId}`, () =>
  api.getGameInfo(gameId),
)

useSeoMeta({ title: () => game.value?.name ?? 'Game', robots: 'noindex' })

watchImmediate(error, () => {
  if (error.value) {
    toast.error(t('errors.gameLoadFailed'))
  }
})

const { gameState, players } = useGameConnection(game)

const playerListOpen = ref(false)
</script>

<style scoped>
.game-board {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.player-list-fab {
  position: absolute;
  bottom: 24px;
  right: 24px;
}
</style>
