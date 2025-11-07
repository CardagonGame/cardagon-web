<script setup lang="ts">
const username = ref('')
const password = ref('')
</script>

<template>
  <div class="login-form">
    <form>
      <FormInput v-model="username" label="Username" type="text" />
      <FormInput v-model="password" label="Password" type="password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.login-form {
}
</style>
