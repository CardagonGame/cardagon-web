export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: true },

  modules: [
    'vuetify-nuxt-module',
    '@nuxt/fonts',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    'nuxt-security',
  ],

  fonts: {
    families: [{ name: 'MuseoModerno', provider: 'google' }],
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
          ripple: false,
        },
      },
      theme: {
        defaultTheme: 'warmDark',
        themes: {
          warmDark: {
            dark: true,
            colors: {
              primary: '#db6d14',
              secondary: '#9a9088',
              background: '#3c3b38',
              surface: '#4c4b47',
              error: '#FF5449',
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
          "'self'",
          "'unsafe-inline'",
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
