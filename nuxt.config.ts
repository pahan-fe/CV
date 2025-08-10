// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app',
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
        // Avoid default app-shell navigation fallback which can serve stale index.html
        navigateFallback: null,
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        // Do not precache HTML files; only static assets
        globPatterns: ['**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
        globIgnores: ['**/*.html'],
        // In SSR, avoid navigateFallback to a non-existent precached '/index.html'.
        // Provide an offline fallback for navigation requests instead.
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkOnly',
            options: {
              plugins: [
                {
                  // When navigation fails (offline), serve the precached offline page
                  handlerDidError: async () => caches.match('/offline.html')
                }
              ]
            }
          }
        ],
        // Only ensure offline page is precached; do not precache '/'
        additionalManifestEntries: [
          { url: '/offline.html', revision: null }
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
  cacheMaxAgeSeconds: 60 * 10, // 10 minutes
  exclude: ['/offline.html']
  },
  // @nuxtjs/robots configuration
  robots: {
  allow: ['/'],
  disallow: ['/offline.html'],
  sitemap: ['/sitemap.xml']
  }
})