// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app',
  // Enable SPA mode so the app shell (index.html) is generated and can be cached for offline use
  ssr: false,
  pages: true,
  css: ['~/shared/styles/reset.css'],
  app: {
    head: {
      // Default to dark to avoid first-render flip
      htmlAttrs: { lang: 'en', 'data-theme': 'dark' },
      meta: [
        { name: 'theme-color', content: '#0e0e0e' }
      ],
      // No inline script/styles to avoid theme switching during first render
    }
  },
  modules: [
    '@nuxt/eslint',
  // SEO and discovery
  '@nuxtjs/sitemap',
  '@nuxtjs/robots',
  'nuxt-schema-org',
    ['@vite-pwa/nuxt', {
      registerType: 'autoUpdate',
      // Disable SW during development to avoid offline.html showing while online
      devOptions: { enabled: false, suppressWarnings: true },
      workbox: process.env.NODE_ENV === 'production' ? {
        // Use an app-shell SPA fallback so navigation works offline
        navigateFallback: '/index.html',
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        // Precache HTML and static assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
        // Ensure app shell is precached even when running with Nitro server
        additionalManifestEntries: [
          { url: '/index.html', revision: null }
        ],
        // Runtime strategies for better UX and offline capability
        runtimeCaching: [
          {
            // Documents: try network, fall back to cache (index.html) when offline
            urlPattern: ({ request }) => request.mode === 'navigate' || request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              networkTimeoutSeconds: 3
            }
          },
          {
            // JS/CSS/workers: fast from cache, update in background
            urlPattern: ({ request }) => ['script', 'style', 'worker'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets-cache'
            }
          },
          {
            // Images and fonts: cache first with expiration
            urlPattern: ({ request }) => ['image', 'font'].includes(request.destination),
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
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
  ],
  // Public runtime config used by SEO modules and in-app canonical links
  runtimeConfig: {
    public: {
      // Set this via NUXT_SITE_URL in production (e.g. https://your-domain.tld)
      siteUrl: process.env.NUXT_SITE_URL || 'http://localhost:3000'
    }
  },
  // @nuxtjs/sitemap configuration
  sitemap: {
  includeAppSources: true,
  cacheMaxAgeSeconds: 60 * 10 // 10 minutes
  },
  // @nuxtjs/robots configuration
  robots: {
  allow: ['/'],
  sitemap: ['/sitemap.xml']
  }
})