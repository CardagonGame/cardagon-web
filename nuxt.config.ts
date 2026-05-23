export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: true },

  app: {
    head: {
      charset: 'utf-8',
      titleTemplate: '%s ♦ Cardagon',
      meta: [
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
        },
        {
          name: 'description',
          content: 'Cardagon – play card games with friends online.',
        },
        { name: 'theme-color', content: '#3c3b38' },
        { property: 'og:site_name', content: 'Cardagon' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/logo.png' },
        { name: 'twitter:card', content: 'summary' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  modules: [
    'vuetify-nuxt-module',
    '@nuxt/fonts',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
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

  nitro: {
    devProxy: {
      '/api': { target: 'http://localhost:8000/api', changeOrigin: true },
    },
  },
})
