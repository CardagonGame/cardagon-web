import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import dns from 'node:dns'
import unocss from 'unocss/vite'
import { defineConfig } from 'vite'
import paths from 'vite-tsconfig-paths'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    paths(),
    unocss(),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
