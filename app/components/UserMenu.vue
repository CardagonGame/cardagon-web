<template>
  <v-app-bar flat color="surface">
    <v-app-bar-title>
      <span class="font-weight-bold text-decoration-none">
        <nuxt-link to="/">Cardagon</nuxt-link>
      </span>
    </v-app-bar-title>
    <template v-if="user" #append>
      <span class="text-body-medium mr-2 text-medium-emphasis">{{
        user.username
      }}</span>
      <v-btn
        :title="t('auth.logout')"
        icon="mdi-logout"
        variant="text"
        @click="logout"
      >
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { user, logout: authLogout } = useAuth()

async function logout() {
  authLogout()
  await navigateTo('/login')
}
</script>
