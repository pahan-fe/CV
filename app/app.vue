<script setup lang="ts">
// Compute the current absolute URL for canonical and OG url
const url = useRequestURL()
const siteName = 'Pavel Zagvozdin — CV'
const config = useRuntimeConfig()
const route = useRoute()
const canonical = computed(() => `${config.public.siteUrl}${route.path}`)
const ogImage = computed(() => `${config.public.siteUrl}/og.png`)
// Theme color for browser UI that matches current theme
import { useTheme } from '~/features/theme-toggle/model/useTheme'
const { theme } = useTheme()
const metaThemeColor = computed(() => (theme.value === 'dark' ? '#0e0e0e' : '#ffffff'))

// Use a custom laptop favicon in production to avoid Nuxt default icon
const faviconLinks = import.meta.dev
  ? [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'shortcut icon', href: '/favicon.ico' }
    ]
  : [
  // SVG laptop icon (monotone)
  { rel: 'icon', type: 'image/svg+xml', sizes: 'any', href: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236b7280"><path d="M4 6h16a1 1 0 0 1 1 1v9H3V7a1 1 0 0 1 1-1z"/><path d="M2 18h20v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z"/></svg>' }
    ]

// Online/offline state for showing an in-app banner
const isOnline = ref(true)
let onOnline: () => void
let onOffline: () => void

onMounted(() => {
  isOnline.value = navigator.onLine
  onOnline = () => { isOnline.value = true }
  onOffline = () => { isOnline.value = false }
  window.addEventListener('online', onOnline)
  window.addEventListener('offline', onOffline)
})

onBeforeUnmount(() => {
  if (onOnline) window.removeEventListener('online', onOnline)
  if (onOffline) window.removeEventListener('offline', onOffline)
})

useHead({
  // Avoid duplicating the site name when a page title is already provided
  titleTemplate: (titleChunk?: string) => (titleChunk ? titleChunk : siteName),
  htmlAttrs: { lang: 'en' },
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { charset: 'utf-8' }
  ],
  link: [
  { rel: 'canonical', href: canonical.value },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
  ...faviconLinks
  ]
})

useSeoMeta({
  // Basic
  title: siteName,
  description: 'Frontend developer CV.',
  robots: 'index, follow',

  // Open Graph
  ogTitle: siteName,
  ogDescription: 'Frontend developer CV.',
  ogType: 'website',
  ogUrl: url.href,
  ogSiteName: siteName,
  ogImage: ogImage.value,
  ogImageAlt: siteName,

  // Twitter
  twitterCard: 'summary_large_image',
  twitterTitle: siteName,
  twitterDescription: 'Frontend developer CV.',
  twitterImage: ogImage.value,

  // Browser UI
  themeColor: metaThemeColor
})
</script>

<template>
  <div id="app">
  <div v-if="!isOnline" class="offline-banner">You’re offline. Viewing cached content.</div>
    <div class="page">
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped>
  #app {
    background: linear-gradient(180deg, var(--bg) 0%, var(--bg-soft) 100%);
    color: var(--fg);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  }
  .offline-banner {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: var(--bg-soft);
    color: var(--fg);
    padding: 8px 12px;
    text-align: center;
    border-bottom: 1px solid var(--accent);
  }
  .page { flex: 1 1 auto; min-height: 1px; }
</style>