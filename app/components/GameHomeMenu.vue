<template>
  <v-card width="540">
    <div class="px-4 pt-4 pb-4">
      <div class="d-flex justify-center mb-6">
        <img src="/logo.png" alt="Cardagon" style="width: 220px" />
      </div>
      <div class="d-flex flex-column ga-4">
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
        <div class="d-flex align-center ga-3">
          <v-text-field
            v-model="joinCode"
            :label="t('game.enterJoinCode')"
            density="comfortable"
            hide-details
            @keyup.enter="joinGameAction"
          />
          <v-btn
            color="secondary"
            size="large"
            :loading="joining"
            :disabled="!joinCode.trim()"
            @click="joinGameAction"
          >
            {{ t('game.join') }}
          </v-btn>
        </div>
      </div>
    </div>

    <v-divider />

    <GameList
      :hosted="gamesData?.hosted ?? []"
      :joined="gamesData?.joined ?? []"
      :pending="pending"
      @refresh="refresh"
    />
  </v-card>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'

const { t } = useI18n()
const api = useApi()

const joinCode = ref('')
const creating = ref(false)
const joining = ref(false)

const { data: gamesData, pending, refresh } = await useAsyncData('my-games', () => api.listGames())

async function createGame() {
  creating.value = true
  try {
    const game = await api.createGame()
    await refresh()
    await navigateTo(`/game/${game.game_id}`)
  } catch {
    toast.error(t('errors.createGameFailed'))
  } finally {
    creating.value = false
  }
}

async function joinGameAction() {
  if (!joinCode.value.trim()) return
  joining.value = true
  try {
    const game = await api.joinGame(joinCode.value.trim())
    await refresh()
    await navigateTo(`/game/${game.game_id}`)
  } catch {
    toast.error(t('errors.joinGameFailed'))
  } finally {
    joining.value = false
  }
}
</script>
