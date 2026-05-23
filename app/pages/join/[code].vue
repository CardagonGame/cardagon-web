<template>
  <v-container class="mt-8 text-center">
    <v-progress-circular indeterminate color="primary" />
  </v-container>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { FetchError } from 'ofetch'

useSeoMeta({ title: 'Joining Game…', robots: 'noindex' })

const { isAuthenticated } = useAuth()
const route = useRoute()
const api = useApi()
const { t } = useI18n()

const code = route.params.code as string

if (!isAuthenticated.value) {
  await navigateTo(`/login?returnUrl=/join/${code}`)
} else {
  try {
    const game = await api.joinGame(code)
    await navigateTo(`/game/${game.game_id}/setup`)
  } catch (err) {
    const msg = (err as FetchError)?.data?.detail === 'game_already_started'
      ? t('errors.joinGameStarted')
      : t('errors.joinGameFailed')
    toast.error(msg)
    await navigateTo('/')
  }
}
</script>
