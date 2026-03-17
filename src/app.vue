<script setup lang="ts">
import { useTheme } from './features/theme-toggle/model/useTheme'
import { THEME_COLORS } from './shared/lib/theme'
import StarField from './shared/ui/StarField.vue'

const url = useRequestURL()
const siteName = 'Pavel Zagvozdin — CV'
const config = useRuntimeConfig()
const route = useRoute()
const canonical = computed(() => `${config.public.siteUrl}${route.path}`)
const ogImage = computed(() => `${config.public.siteUrl}/og.png`)
const { theme } = useTheme()
const metaThemeColor = computed(() => THEME_COLORS[theme.value])

const faviconLinks = import.meta.dev
  ? [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'shortcut icon', href: '/favicon.ico' },
    ]
  : [
      { rel: 'icon', type: 'image/svg+xml', sizes: 'any', href: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236b7280"><path d="M4 6h16a1 1 0 0 1 1 1v9H3V7a1 1 0 0 1 1-1z"/><path d="M2 18h20v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z"/></svg>' },
    ]

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
  titleTemplate: (titleChunk?: string) => (titleChunk ? titleChunk : siteName),
  htmlAttrs: { lang: 'en' },
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { charset: 'utf-8' },
  ],
  link: [
    { rel: 'canonical', href: canonical.value },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Darker+Grotesque:wght@400;500;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap' },
    ...faviconLinks,
  ],
})

useSeoMeta({
  title: siteName,
  description: 'Senior Frontend Engineer CV.',
  robots: 'index, follow',
  ogTitle: siteName,
  ogDescription: 'Senior Frontend Engineer CV.',
  ogType: 'website',
  ogUrl: url.href,
  ogSiteName: siteName,
  ogImage: ogImage.value,
  ogImageAlt: siteName,
  twitterCard: 'summary_large_image',
  twitterTitle: siteName,
  twitterDescription: 'Senior Frontend Engineer CV.',
  twitterImage: ogImage.value,
  themeColor: metaThemeColor,
})
</script>

<template>
  <div id="app">
    <StarField v-if="theme === 'dark'" />
    <div v-if="!isOnline" class="offline-banner">You're offline. Viewing cached content.</div>
    <NuxtPage />
  </div>
</template>

<style scoped>
#app {
  background: var(--bg);
  color: var(--fg);
  min-height: 100vh;
  position: relative;
  font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
}

.offline-banner {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--accent-soft);
  color: var(--accent);
  padding: 8px 12px;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  border-bottom: 1px solid var(--accent);
}
</style>
