import { ref } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

// Singleton state shared across composable callers
const theme = ref<Theme>('dark')
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

  // Start with dark, only override if a stored preference exists
  try {
    const s = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (s === 'light' || s === 'dark') {
      theme.value = s
    }
  } catch { /* ignore */ }
  apply(theme.value)
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
