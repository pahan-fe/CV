<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
// Compute the current absolute URL for canonical and OG url
const url = useRequestURL()
const siteName = 'Pavel Zagvozdin'

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
  // Title template for consistency across pages (if you add more routes later)
  titleTemplate: (titleChunk?: string) => (titleChunk ? `${titleChunk} | ${siteName}` : siteName),
  link: [
    { rel: 'canonical', href: url.href }
  ]
})

useSeoMeta({
  // Basic
  title: 'Pavel Zagvozdin',
  description: 'Frontend developer CV.',

  // Open Graph
  ogTitle: 'Pavel Zagvozdin',
  ogDescription: 'Frontend developer CV.',
  ogType: 'website',
  ogUrl: url.href,
  ogSiteName: siteName,
})
</script>

<template>
  <div id="app">
  <div v-if="!isOnline" class="offline-banner">You’re offline. Viewing cached content.</div>
    <AppHeader />
    <div class="page">
      <NuxtPage />
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
  #app {
  background-color: var(--bg);
  color: var(--fg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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