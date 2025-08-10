// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app',
  pages: true,
  css: ['~/shared/styles/reset.css'],
  // Ensure theme is set as early as possible on the client to avoid a flash
  // of incorrect theme when statically hosted (no SSR at runtime).
  app: {
    head: {
      // Default to light; an inline script below will flip to dark if needed
      htmlAttrs: { lang: 'en', 'data-theme': 'light' },
      meta: [
        // Ensure a theme-color tag exists early for the inline script to update
        { name: 'theme-color', content: '#ffffff' }
      ],
      // Minimal inline CSS to avoid white flash before CSS loads
      style: [
        {
          key: 'theme-bg-inline',
          tagPriority: 'critical',
          children: `html{background-color:#ffffff;color-scheme:light} @media (prefers-color-scheme: dark){html{background-color:#0e0e0e;color-scheme:dark}} html[data-theme="dark"]{background-color:#0e0e0e;color-scheme:dark} html[data-theme="light"]{background-color:#ffffff;color-scheme:light} body{background:transparent}`
        }
      ],
      script: [
        {
          key: 'theme-inline-early',
          tagPosition: 'head',
          // Full inline logic: set data-theme and meta[name="theme-color"] with no network
          children: `(function(){try{var w=window,d=document,e=d.documentElement,s=null;try{s=localStorage.getItem('theme')}catch(_){/* ignore */}var mql=w.matchMedia&&w.matchMedia('(prefers-color-scheme: dark)'),t=(s==='light'||s==='dark')?s:(mql&&mql.matches?'dark':'light');e.dataset.theme=t;var m=d.querySelector('meta[name="theme-color"]');if(!m){m=d.createElement('meta');m.setAttribute('name','theme-color');d.head.appendChild(m);}m.setAttribute('content',t==='dark'?'#0e0e0e':'#ffffff');}catch(_){/* ignore */}})();`
        }
      ]
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
        additionalManifestEntries: [
          { url: '/', revision: null },
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