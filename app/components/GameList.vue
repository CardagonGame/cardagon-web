<template>
  <v-progress-linear v-if="pending" indeterminate color="primary" />

  <template v-else-if="hosted.length || joined.length">
    <template v-if="hosted.length">
      <v-list-subheader class="px-4">{{
        t('game.hostedGames')
      }}</v-list-subheader>
      <v-list lines="two" class="pa-0">
        <v-list-item
          v-for="game in sortedHosted"
          :key="game.game_id"
          :title="game.name"
          :subtitle="formatDate(game.date_created)"
          class="px-4"
          @click="navigateTo(`/game/${game.game_id}`)"
        >
          <template #append>
            <v-btn
              icon="mdi-delete-outline"
              size="small"
              variant="text"
              color="error"
              :loading="deleting === game.game_id"
              @click.stop="deleteGame(game)"
            />
            <v-icon icon="mdi-chevron-right" />
          </template>
        </v-list-item>
      </v-list>
    </template>

    <v-divider v-if="hosted.length && joined.length" />

    <template v-if="joined.length">
      <v-list-subheader class="px-4">{{
        t('game.joinedGames')
      }}</v-list-subheader>
      <v-list lines="two" class="pa-0 pb-2">
        <v-list-item
          v-for="game in sortedJoined"
          :key="game.game_id"
          :title="game.name"
          :subtitle="formatDate(game.date_created)"
          class="px-4"
          @click="navigateTo(`/game/${game.game_id}`)"
        >
          <template #append>
            <v-btn
              icon="mdi-delete-outline"
              size="small"
              variant="tonal"
              color="error"
              :loading="deleting === game.game_id"
              @click.stop="deleteGame(game)"
            />
            <v-icon icon="mdi-chevron-right" />
          </template>
        </v-list-item>
      </v-list>
    </template>
  </template>

  <p v-else class="text-medium-emphasis text-body-2 text-center px-4 py-3">
    {{ t('game.noGames') }}
  </p>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { GamePublic } from '~/composables/useApi'

const props = defineProps<{
  hosted: GamePublic[]
  joined: GamePublic[]
  pending: boolean
}>()

const emit = defineEmits<{ refresh: [] }>()

const { t } = useI18n()
const api = useApi()
const { confirm } = useConfirm()

const deleting = ref<string | null>(null)

const isClient = ref(false)
onMounted(() => {
  isClient.value = true
})

function formatDate(iso: string) {
  if (!isClient.value) return ''
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function sortByDate(games: GamePublic[]) {
  return [...games].sort(
    (a, b) =>
      new Date(b.date_created).getTime() - new Date(a.date_created).getTime(),
  )
}

const sortedHosted = computed(() => sortByDate(props.hosted))
const sortedJoined = computed(() => sortByDate(props.joined))

async function deleteGame(game: GamePublic) {
  const confirmed = await confirm({
    title: `Delete "${game.name}"?`,
    message: 'This cannot be undone.',
    confirmText: 'Delete',
    color: 'error',
  })
  if (!confirmed) return

  deleting.value = game.game_id
  try {
    await api.deleteGame(game.game_id)
    emit('refresh')
  } catch {
    toast.error(t('errors.deleteGameFailed'))
  } finally {
    deleting.value = null
  }
}
</script>
