<template>
  <div class="d-flex flex-column align-center">
  <img src="/logo.png" alt="Cardagon" class="mb-6" style="width: 220px" />
  <v-card width="400" class="pa-6">
    <v-card-title class="mb-4 pl-0">{{ t('auth.login') }}</v-card-title>
    <v-form @submit.prevent="onSubmit">
      <v-text-field
        v-bind="usernameProps"
        v-model="username"
        :label="t('auth.username')"
        :error-messages="errors.username"
        autocomplete="username"
        class="mb-2"
      />
      <v-text-field
        v-bind="passwordProps"
        v-model="password"
        :label="t('auth.password')"
        :error-messages="errors.password"
        type="password"
        autocomplete="current-password"
        class="mb-4"
      />
      <v-btn type="submit" color="primary" block :loading="isSubmitting">
        {{ t('auth.login') }}
      </v-btn>
    </v-form>
    <v-card-text class="text-center mt-4 pa-0">
      {{ t('auth.noAccount') }}
      <NuxtLink to="/register">{{ t('auth.register') }}</NuxtLink>
    </v-card-text>
  </v-card>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import { loginSchema } from '~/schemas/login'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const { t } = useI18n()
const { setToken, setUser } = useAuth()
const api = useApi()

const { handleSubmit, isSubmitting, errors, defineField } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})

const [username, usernameProps] = defineField('username')
const [password, passwordProps] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    const { access_token } = await api.login(values.username, values.password)
    setToken(access_token)
    await nextTick()
    const user = await api.getMe()
    setUser(user)
    await navigateTo('/')
  } catch (e: unknown) {
    const detail = (e as { data?: { detail?: string } })?.data?.detail
    toast.error(detail ?? t('errors.loginFailed'))
  }
})
</script>
