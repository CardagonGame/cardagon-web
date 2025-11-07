<script setup lang="ts">
const model = defineModel<string>({ required: true })

const {} = defineProps<{
  label?: string
  type?: string
}>()
</script>

<template>
  <div class="input">
    <input v-model="model" />
  </div>
</template>

<style scoped lang="scss"></style>
