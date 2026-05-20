<template>
  <v-app-bar flat color="surface">
    <v-app-bar-title>
      <NuxtLink to="/" class="d-flex align-center text-decoration-none ga-2">
        <img src="/logo.png" height="36" alt="Cardagon" />
        <span class="text-h6 font-weight-bold wordmark">Cardagon</span>
      </NuxtLink>
    </v-app-bar-title>

    <template v-if="user" #append>
      <v-menu min-width="200" location="bottom end">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" class="mr-1">
            <v-icon start>mdi-account-circle</v-icon>
            {{ user.username }}
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            :title="user.username"
            :subtitle="user.email"
            lines="two"
            density="compact"
            class="py-3"
          />
          <v-divider />
          <v-list-item
            :title="t('auth.logout')"
            prepend-icon="mdi-logout"
            @click="logout"
          />
        </v-list>
      </v-menu>
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

<style scoped>
.wordmark {
  font-family: 'MuseoModerno', sans-serif;
  color: rgb(var(--v-theme-on-surface));
}
</style>
