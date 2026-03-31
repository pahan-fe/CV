import { ref } from 'vue'
import { THEME_COLORS, THEME_STORAGE_KEY } from '~/shared/lib/theme'
import { trackStorageError } from '~/shared/lib/trackStorageError'
import { useThemeAnalytics } from '~/features/cookie-consent/model/useThemeAnalytics'

export type Theme = 'light' | 'dark'

const theme = ref<Theme>('dark')
let initialized = false

const apply = (t: Theme) => {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = t
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
    if (meta) {
      meta.setAttribute('content', THEME_COLORS[t])
    }
  }
}

const init = () => {
  if (initialized || typeof window === 'undefined') {
    return
  }
  initialized = true

  try {
    const s = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    if (s === 'light' || s === 'dark') {
      theme.value = s
    }
  } catch (e) {
    trackStorageError('read', e)
  }
  apply(theme.value)
}

type DocumentWithViewTransition = Document & { startViewTransition: (callback: () => void) => void }
const hasViewTransition = (doc: Document): doc is DocumentWithViewTransition => {
  return 'startViewTransition' in doc
}

export function useTheme() {
  init()

  const { start: startAnalytics, trackToggle } = useThemeAnalytics()

  if (typeof window !== 'undefined') {
    startAnalytics(theme.value)
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme.value)
    } catch (e) {
      trackStorageError('write', e)
    }

    trackToggle(theme.value)

    const update = () => apply(theme.value)

    if (typeof document !== 'undefined' && hasViewTransition(document)) {
      document.startViewTransition(update)
    } else {
      update()
    }
  }

  return { theme, toggleTheme }
}
