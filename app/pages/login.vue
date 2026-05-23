<template>
  <div class="d-flex flex-column align-center">
    <img src="/logo.svg" alt="Cardagon" class="mb-6" style="width: 220px" />
    <v-card width="400" class="pa-6">
      <v-card-title class="mb-4 pl-0">{{ t('auth.login') }}</v-card-title>
      <v-form @submit.prevent="onSubmit">
        <v-text-field
          v-bind="emailProps"
          v-model="email"
          :label="t('auth.email')"
          :error-messages="errors.email"
          autocomplete="email"
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
        <NuxtLink
          :to="
            returnUrl
              ? `/register?returnUrl=${encodeURIComponent(returnUrl)}`
              : '/register'
          "
          >{{ t('auth.register') }}</NuxtLink
        >
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
useSeoMeta({
  title: 'Login',
  description: 'Log in to your Cardagon account.',
  robots: 'noindex',
})

const { t } = useI18n()
const { setToken, setUser } = useAuth()
const api = useApi()
const route = useRoute()
const returnUrl = computed(() =>
  safeReturnUrl(route.query.returnUrl as string | undefined),
)

const { handleSubmit, isSubmitting, errors, defineField } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})

const [email, emailProps] = defineField('email')
const [password, passwordProps] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    const { access_token } = await api.login(values.email, values.password)
    setToken(access_token)
    await nextTick()
    const user = await api.getMe()
    setUser(user)
    await navigateTo(returnUrl.value ?? '/')
  } catch (e: unknown) {
    const detail = (e as { data?: { detail?: string } })?.data?.detail
    toast.error(detail ?? t('errors.loginFailed'))
  }
})
</script>
