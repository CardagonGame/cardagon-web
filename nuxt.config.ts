export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/fonts',
    '@nuxtjs/i18n',
    '@nuxt/icon',
    '@vueuse/nuxt',
    'nuxt-security',
  ],
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
        defaultTheme: 'light',
        themes: {
          light: {
            colors: {
              primary: '#db6d14',
              secondary: '#65625b',
              background: '#e9e0d1',
              surface: '#CBC4B7',
              error: '#B3261E',
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
