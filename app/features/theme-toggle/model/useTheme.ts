import { ref } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

// Singleton state shared across composable callers
const theme = ref<Theme>('light')
let initialized = false

function apply(t: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = t
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
    if (meta) meta.setAttribute('content', t === 'dark' ? '#0e0e0e' : '#ffffff')
  }
}

function init() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  const getStored = (): Theme | null => {
    const s = localStorage.getItem(STORAGE_KEY) as Theme | null
    return s === 'light' || s === 'dark' ? s : null
  }

  const mql = window.matchMedia?.('(prefers-color-scheme: dark)')

  const setFromSystem = () => {
    const t: Theme = mql?.matches ? 'dark' : 'light'
    // Only follow system when user hasn't chosen explicitly
    if (!getStored()) {
      theme.value = t
      apply(t)
    }
  }

  const stored = getStored()
  if (stored) {
    theme.value = stored
  } else {
    theme.value = mql?.matches ? 'dark' : 'light'
  }
  apply(theme.value)

  // React to system theme changes when there's no stored preference
  if (mql && typeof mql.addEventListener === 'function') {
    mql.addEventListener('change', setFromSystem)
  } else if (mql && typeof mql.addListener === 'function') {
    // Safari < 14 fallback
    mql.addListener(setFromSystem)
  }

  // Sync across tabs/windows
  window.addEventListener('storage', (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      const val = (e.newValue as Theme | null)
      if (val === 'light' || val === 'dark') {
        theme.value = val
        apply(val)
      } else if (val == null) {
        // Preference cleared in another tab — follow system
        setFromSystem()
      }
    }
  })
}

export function useTheme() {
  init()

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem(STORAGE_KEY, theme.value)
    } catch {
      // ignore write errors (Safari private mode, etc.)
    }
    apply(theme.value)
  }

  return { theme, toggleTheme }
}
