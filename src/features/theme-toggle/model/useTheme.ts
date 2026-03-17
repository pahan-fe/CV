import { ref } from 'vue'
import { THEME_COLORS, THEME_STORAGE_KEY } from '~/shared/lib/theme'

export type Theme = 'light' | 'dark'

const theme = ref<Theme>('dark')
let initialized = false

function apply(t: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = t
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
    if (meta) meta.setAttribute('content', THEME_COLORS[t])
  }
}

function init() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  try {
    const s = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    if (s === 'light' || s === 'dark') {
      theme.value = s
    }
  } catch {}
  apply(theme.value)
}

export function useTheme() {
  init()

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme.value)
    } catch {}
    apply(theme.value)
  }

  return { theme, toggleTheme }
}
