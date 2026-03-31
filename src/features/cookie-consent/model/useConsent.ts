import { ref } from 'vue'
import { trackStorageError } from '~/shared/lib/trackStorageError'

const CONSENT_KEY = 'analytics_consent'

export type ConsentStatus = 'granted' | 'declined' | null

const status = ref<ConsentStatus>(null)
let initialized = false

const readStored = (): ConsentStatus => {
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    if (v === 'granted' || v === 'declined') {
      return v
    }
  } catch (e) {
    trackStorageError('read', e)
  }
  return null
}

const updateGtag = (analyticsStorage: 'granted' | 'denied') => {
  const { gtag } = useGtag()

  gtag('consent', 'update', {
    ad_storage: 'denied',
    ad_personalization: 'denied',
    ad_user_data: 'denied',
    analytics_storage: analyticsStorage,
  })
}

export const useConsent = () => {
  if (!initialized && typeof window !== 'undefined') {
    initialized = true
    status.value = readStored()
    if (status.value === 'declined') {
      updateGtag('denied')
    }
  }

  const accept = () => {
    status.value = 'granted'
    try {
      localStorage.setItem(CONSENT_KEY, 'granted')
    } catch (e) {
      trackStorageError('write', e)
    }
  }

  const decline = () => {
    status.value = 'declined'
    try {
      localStorage.setItem(CONSENT_KEY, 'declined')
    } catch (e) {
      trackStorageError('write', e)
    }
    updateGtag('denied')
  }

  const shouldShow = computed(() => status.value === null)

  return { status, shouldShow, accept, decline }
}
