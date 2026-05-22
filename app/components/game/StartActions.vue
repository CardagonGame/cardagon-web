<template>
  <v-card-actions class="px-4 pt-3 pb-2 d-flex flex-column align-stretch ga-2">
    <v-btn
      block
      color="primary"
      variant="flat"
      prepend-icon="mdi-play"
      :disabled="wsStatus !== 'OPEN' || playerCount < 2"
      @click="$emit('start')"
      >{{ t('game.start') }}</v-btn
    >
    <p
      v-if="playerCount < 2"
      class="text-body-2 text-medium-emphasis text-center ma-0"
    >
      {{ t('game.notEnoughPlayers') }}
    </p>
  </v-card-actions>
</template>

<script setup lang="ts">
defineProps<{
  wsStatus: string
  playerCount: number
}>()

defineEmits<{
  start: []
}>()

const { t } = useI18n()
</script>
