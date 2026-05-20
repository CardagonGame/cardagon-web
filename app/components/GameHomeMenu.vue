<template>
  <v-card width="360" class="pa-6">
    <v-card-title class="mb-6 text-center">Cardagon</v-card-title>
    <div class="d-flex flex-column ga-3">
      <v-btn
        color="primary"
        size="large"
        block
        :loading="creating"
        prepend-icon="mdi:plus"
        @click="createGame"
      >
        {{ t('game.createNew') }}
      </v-btn>
      <div class="d-flex ga-2">
        <v-text-field
          v-model="joinCode"
          :label="t('game.enterJoinCode')"
          density="compact"
          hide-details
          @keyup.enter="joinGame"
        />
        <v-btn
          color="secondary"
          :loading="joining"
          :disabled="!joinCode.trim()"
          @click="joinGame"
        >
          {{ t('game.join') }}
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'

const { t } = useI18n()
const api = useApi()

const joinCode = ref('')
const creating = ref(false)
const joining = ref(false)

async function createGame() {
  creating.value = true
  try {
    const game = await api.createGame()
    await navigateTo(`/game/${game.game_id}`)
  }
  catch {
    toast.error(t('errors.createGameFailed'))
  }
  finally {
    creating.value = false
  }
}

async function joinGame() {
  if (!joinCode.value.trim()) return
  joining.value = true
  try {
    const game = await api.joinGame(joinCode.value.trim())
    await navigateTo(`/game/${game.game_id}`)
  }
  catch {
    toast.error(t('errors.joinGameFailed'))
  }
  finally {
    joining.value = false
  }
}
</script>
