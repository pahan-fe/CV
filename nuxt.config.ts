export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'src',
  ssr: true,
  pages: true,
  css: ['~/shared/ui/reset.css'],
  components: [
    { path: '~/shared/ui', pathPrefix: false },
    { path: '~/features', pathPrefix: true }
  ],
  app: {
    head: {
      htmlAttrs: { lang: 'en', 'data-theme': 'dark' },
      meta: [
        { name: 'theme-color', content: '#0a0a0a' },
      ],
      script: [
        { innerHTML: '(function(){try{var s=localStorage.getItem("theme");var d=window.matchMedia&&window.matchMedia("(prefers-color-scheme:dark)").matches;var t=(s==="light"||s==="dark")?s:(d?"dark":"light");document.documentElement.dataset.theme=t}catch(e){}})()' }
      ],
    }
  },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-schema-org',
    ['nuxt-gtag', {
      id: process.env.NUXT_PUBLIC_GTAG_ID || '',
      initCommands: [
        ['consent', 'default', {
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          ad_storage: 'denied',
          analytics_storage: 'granted',
        }],
      ],
    }],
    ['@vite-pwa/nuxt', {
      registerType: 'prompt',
      devOptions: { enabled: false, suppressWarnings: true },
      workbox: process.env.NODE_ENV === 'production' ? {
        navigateFallback: null,
        skipWaiting: false,
        clientsClaim: false,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
        additionalManifestEntries: [
          { url: '/offline.html', revision: null }
        ],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate' || request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24
              },
              plugins: [
                {
                  handlerDidError: async () => caches.match('/offline.html')
                }
              ]
            }
          },
          {
            urlPattern: ({ request }) => ['script', 'style', 'worker'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets-cache'
            }
          },
          {
            urlPattern: ({ request }) => ['image', 'font'].includes(request.destination),
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      } : undefined,
      manifest: {
        name: 'Pavel Zagvozdin — CV',
        short_name: 'Pavel CV',
        description: 'Senior Frontend Engineer CV',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
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
  ],
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_SITE_URL || 'http://localhost:3000'
    }
  },
  sitemap: {
    includeAppSources: true,
    cacheMaxAgeSeconds: 60 * 10,
    exclude: ['/offline.html'],
  },
  robots: {
    allow: ['/'],
    disallow: ['/offline.html'],
    sitemap: ['/sitemap.xml'],
  }
})
