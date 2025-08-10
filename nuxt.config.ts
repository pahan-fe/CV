// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app',
  pages: true,
  css: ['~/shared/styles/reset.css'],
  modules: [
    '@nuxt/eslint',
    ['@vite-pwa/nuxt', {
      registerType: 'autoUpdate',
      // Disable SW during development to avoid offline.html showing while online
      devOptions: { enabled: false, suppressWarnings: true },
      workbox: process.env.NODE_ENV === 'production' ? {
        navigateFallback: '/'
      } : undefined,
      manifest: {
        name: 'Pavel Zagvozdin — CV',
        short_name: 'Pavel CV',
        description: 'Frontend developer CV',
        theme_color: '#020420',
        background_color: '#020420',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          }
        ]
      },
      client: {
        installPrompt: true,
        periodicSyncForUpdates: 24 * 60 * 60 * 1000
      }
    }]
  ]
})