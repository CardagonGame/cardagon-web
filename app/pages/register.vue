<template>
  <div class="d-flex flex-column align-center">
  <img src="/logo.png" alt="Cardagon" class="mb-6" style="width: 220px" />
  <v-card width="400" class="pa-6">
    <v-card-title class="mb-4">{{ t('auth.register') }}</v-card-title>
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
        v-bind="emailProps"
        v-model="email"
        :label="t('auth.email')"
        :error-messages="errors.email"
        type="email"
        autocomplete="email"
        class="mb-2"
      />
      <v-text-field
        v-bind="passwordProps"
        v-model="password"
        :label="t('auth.password')"
        :error-messages="errors.password"
        type="password"
        autocomplete="new-password"
        class="mb-2"
      />
      <v-text-field
        v-bind="repeatPasswordProps"
        v-model="repeatPassword"
        :label="t('auth.repeatPassword')"
        :error-messages="errors.repeatPassword"
        type="password"
        autocomplete="new-password"
        class="mb-2"
      />
      <v-text-field
        v-bind="inviteTokenProps"
        v-model="inviteToken"
        :label="t('auth.inviteToken')"
        :error-messages="errors.inviteToken"
        class="mb-4"
      />
      <v-btn type="submit" color="primary" block :loading="isSubmitting">
        {{ t('auth.register') }}
      </v-btn>
    </v-form>
    <v-card-text class="text-center mt-4 pa-0">
      {{ t('auth.hasAccount') }}
      <NuxtLink :to="returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/login'">{{ t('auth.login') }}</NuxtLink>
    </v-card-text>
  </v-card>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import { registerSchema } from '~/schemas/register'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const { t } = useI18n()
const api = useApi()
const route = useRoute()
const returnUrl = computed(() => safeReturnUrl(route.query.returnUrl as string | undefined))

const { handleSubmit, isSubmitting, errors, defineField } = useForm({
  validationSchema: toTypedSchema(registerSchema),
})

const [username, usernameProps] = defineField('username')
const [email, emailProps] = defineField('email')
const [password, passwordProps] = defineField('password')
const [repeatPassword, repeatPasswordProps] = defineField('repeatPassword')
const [inviteToken, inviteTokenProps] = defineField('inviteToken')

const onSubmit = handleSubmit(async (values) => {
  try {
    const { username: registeredUsername } = await api.register(
      values.username,
      values.email,
      values.password,
      values.inviteToken,
    )
    toast.success(`Welcome, ${registeredUsername}!`)
    await navigateTo(returnUrl.value ? `/login?returnUrl=${encodeURIComponent(returnUrl.value)}` : '/login')
  }
  catch (e: unknown) {
    const detail = (e as { data?: { detail?: string } })?.data?.detail
    toast.error(detail ?? t('errors.registerFailed'))
  }
})
</script>
