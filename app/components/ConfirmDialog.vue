<template>
  <v-dialog v-model="dialog.open" max-width="400" persistent>
    <v-card :title="dialog.title">
      <v-card-text v-if="dialog.message">{{ dialog.message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="answer(false)">{{ dialog.cancelText }}</v-btn>
        <v-btn :color="dialog.color" variant="tonal" @click="answer(true)">{{ dialog.confirmText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const { dialog, answer } = useConfirm()
</script>
