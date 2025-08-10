// Explicitly register the PWA service worker and log status for debugging
// This complements @vite-pwa/nuxt auto-registration

import { defineNuxtPlugin } from '#app'
import { registerSW } from 'virtual:pwa-register'

export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

  try {
    const updateSW = registerSW({
      immediate: true,
      onRegistered(reg) {
        // eslint-disable-next-line no-console
        console.info('[PWA] Service worker registered', reg?.scope)
      },
      onRegisterError(error) {
        // eslint-disable-next-line no-console
        console.error('[PWA] Service worker registration error', error)
      },
      onNeedRefresh() {
        // eslint-disable-next-line no-console
        console.info('[PWA] New content available; will update in background')
      },
      onOfflineReady() {
        // eslint-disable-next-line no-console
        console.info('[PWA] App ready to work offline')
      }
    })

    // Expose a manual trigger if needed in console
    // @ts-expect-error expose for debug
    window.__pwaUpdate = updateSW
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[PWA] Failed to initialize SW registration', err)
  }
})
