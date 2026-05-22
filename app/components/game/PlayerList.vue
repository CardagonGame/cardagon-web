<template>
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
        <span
          v-if="player.ping_ms !== null"
          class="text-body-2 text-medium-emphasis mr-2"
        >
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
</template>

<script setup lang="ts">
import type { WsPlayerInfo } from '~/composables/useApi'

defineProps<{
  players: WsPlayerInfo[]
}>()

const { t } = useI18n()
</script>
