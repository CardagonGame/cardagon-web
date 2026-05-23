<template>
  <v-container class="d-flex justify-center mt-8">
    <GameHomeMenu />
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Play' })
</script>
