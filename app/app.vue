<template>
  <v-app>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster position="top-right" rich-colors />
  </v-app>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<style lang="scss">
html,
body {
  font-family: 'MuseoModerno', sans-serif;
}
</style>
