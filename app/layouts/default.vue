<template>
  <v-app>
    <NuxtRouteAnnouncer />
    <UserMenu />
    <main class="layout-main">
      <slot />
    </main>
    <Toaster position="top-right" rich-colors />
    <ConfirmDialog />
  </v-app>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>

<style>
.layout-main {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  padding-top: 64px;
}
</style>
