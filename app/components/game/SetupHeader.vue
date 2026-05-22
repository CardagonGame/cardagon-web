<template>
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
        >{{ t('game.delete') }}</v-btn
      >
      <v-btn
        v-if="game.your_role !== 'host'"
        prepend-icon="mdi-exit-to-app"
        size="small"
        variant="tonal"
        color="error"
        :loading="leaving"
        @click="leaveGame"
        >{{ t('game.leave') }}</v-btn
      >
    </div>
    <v-chip
      :color="game.your_role === 'host' ? 'primary' : 'secondary'"
      class="mb-3"
    >
      {{ t(`game.role.${game.your_role}`) }}
    </v-chip>
    <div class="d-flex flex-column ga-2">
      <div class="d-flex align-center ga-1">
        <span class="text-medium-emphasis text-body-2 mr-1"
          >{{ t('game.joinCode') }}:</span
        >
        <code
          class="bg-surface-variant rounded px-2 py-1"
          style="font-size: 0.74rem"
          >{{ game.join_code }}</code
        >
        <v-btn
          :icon="copiedCode ? 'mdi-check' : 'mdi-content-copy'"
          size="x-small"
          variant="text"
          :color="copiedCode ? 'success' : undefined"
          :title="t('game.copyJoinCode')"
          @click="copyCode(game.join_code)"
        />
      </div>
      <div class="d-flex align-center ga-1">
        <span class="text-medium-emphasis text-body-2 mr-1"
          >{{ t('game.joinUrl') }}:</span
        >
        <code
          class="bg-surface-variant rounded px-2 py-1"
          style="font-size: 0.74rem"
          >{{ joinUrl }}</code
        >
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
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { GameResponse } from '~/composables/useApi'

const props = defineProps<{
  game: GameResponse
  joinUrl: string
}>()

const { t } = useI18n()
const api = useApi()
const { confirm } = useConfirm()
const { copy: copyCode, copied: copiedCode } = useClipboard()
const { copy: copyUrl, copied: copiedUrl } = useClipboard()

const deleting = ref(false)
const leaving = ref(false)

async function leaveGame() {
  const confirmed = await confirm({
    title: `Leave "${props.game.name}"?`,
    message: 'You can rejoin later with the join code.',
    confirmText: 'Leave',
    color: 'error',
  })
  if (!confirmed) return

  leaving.value = true
  try {
    await api.leaveGame(props.game.game_id)
    navigateTo('/')
  } catch {
    toast.error(t('errors.leaveGameFailed'))
  } finally {
    leaving.value = false
  }
}

async function deleteGame() {
  const confirmed = await confirm({
    title: `Delete "${props.game.name}"?`,
    message: 'This cannot be undone.',
    confirmText: 'Delete',
    color: 'error',
  })
  if (!confirmed) return

  deleting.value = true
  try {
    await api.deleteGame(props.game.game_id)
    navigateTo('/')
  } catch {
    toast.error(t('errors.deleteGameFailed'))
  } finally {
    deleting.value = false
  }
}
</script>
