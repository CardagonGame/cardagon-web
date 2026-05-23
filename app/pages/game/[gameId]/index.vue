<template>
  <div class="game-board">
    <GameHexGrid v-if="gameState.field_size" :radius="gameState.field_size" />
    <v-progress-circular v-else indeterminate color="primary" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const api = useApi()

const gameId = route.params.gameId as string

const { data: game } = await useAsyncData(`game-${gameId}`, () =>
  api.getGameInfo(gameId),
)

const { gameState } = useGameConnection(game)
</script>

<style scoped>
.game-board {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
