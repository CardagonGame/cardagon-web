<template>
  <v-app>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster position="top-right" rich-colors />
    <ConfirmDialog />
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

.v-application {
  background: radial-gradient(ellipse at 50% 35%, #4c4b47, #2c2b28) !important;
  position: relative;

  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url('/noise.svg');
    background-repeat: repeat;
    opacity: 0.15;
    pointer-events: none;
    z-index: 0;
  }
}
</style>
