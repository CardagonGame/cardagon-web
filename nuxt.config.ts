export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    'vuetify-nuxt-module',
    '@nuxt/fonts',
    '@nuxtjs/i18n',
    '@nuxt/icon',
    '@vueuse/nuxt',
    'nuxt-security',
  ],
  runtimeConfig: {
    apiBase: 'http://localhost:8000',
  },
  fonts: {
    families: [{ name: 'Museo Moderno', provider: 'google' }],
  },
  i18n: {
    locales: [{ code: 'en', language: 'en-US', file: 'en.json' }],
    defaultLocale: 'en',
    strategy: 'no_prefix',
  },
  css: ['@/assets/css/globals.scss'],

  vuetify: {
    vuetifyOptions: {
      defaults: {
        global: {
          elevation: 0,
        },
      },
      theme: {
        defaultTheme: 'warmDark',
        themes: {
          warmDark: {
            dark: true,
            colors: {
              primary:    '#db6d14',
              secondary:  '#9a9088',
              background: '#3c3b38',
              surface:    '#4c4b47',
              error:      '#B3261E',
            },
          },
        },
      },
    },
  },

  security: {
    headers: {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        'script-src': [
          "'strict-dynamic'",
          "'nonce-{{nonce}}'",
          ...(process.env.NODE_ENV === 'development' ? ["'unsafe-eval'"] : []),
        ],
      },
    },
  },
  nitro: {
    devProxy: {
      '/api': { target: 'http://localhost:8000/api', changeOrigin: true },
    },
  },
})
