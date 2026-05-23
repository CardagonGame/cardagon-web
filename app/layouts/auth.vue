<template>
  <v-app>
    <NuxtRouteAnnouncer />
    <v-main class="d-flex align-center justify-center">
      <slot />
    </v-main>
    <Toaster position="top-right" rich-colors theme="dark" />
    <ConfirmDialog />
  </v-app>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>
