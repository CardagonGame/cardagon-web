<template>
  <v-container class="mt-8" max-width="500">
    <v-progress-circular v-if="pending" indeterminate color="primary" />
    <v-card v-else-if="game" class="pa-6">
      <v-card-title class="mb-4">{{ game.name }}</v-card-title>
      <v-list>
        <v-list-item>
          <template #prepend>
            <v-icon icon="mdi:identifier" />
          </template>
          <v-list-item-title>{{ t('game.yourRole') }}</v-list-item-title>
          <v-list-item-subtitle>{{
            t(`game.role.${game.your_role}`)
          }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <template #prepend>
            <v-icon icon="mdi:key-variant" />
          </template>
          <v-list-item-title>{{ t('game.joinCode') }}</v-list-item-title>
          <v-list-item-subtitle class="d-flex align-center ga-2">
            <span>{{ game.join_code }}</span>
            <v-btn
              :icon="copied ? 'mdi:check' : 'mdi:content-copy'"
              size="x-small"
              variant="text"
              :color="copied ? 'success' : undefined"
              @click="copy(game!.join_code)"
            />
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'

definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const route = useRoute()
const api = useApi()
const { copy, copied } = useClipboard()

const { data: game, pending } = await useAsyncData(
  `game-${route.params.gameId}`,
  () => api.getGameInfo(route.params.gameId as string),
  {
    lazy: false,
    transform: (data) => data,
  },
)

console.log(game.value)

watch(pending, (isPending, wasPending) => {
  if (wasPending && !isPending && !game.value) {
    toast.error(t('errors.gameLoadFailed'))
  }
})
</script>
