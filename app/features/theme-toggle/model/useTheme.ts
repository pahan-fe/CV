import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

export function useTheme() {
  const theme = ref<Theme>('dark')

  const apply = (t: Theme) => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = t
    }
  }

  if (typeof window !== 'undefined') {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null)
    if (stored === 'light' || stored === 'dark') {
      theme.value = stored
    } else {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? 'dark' : 'light'
    }
    apply(theme.value)

    watch(theme, (t) => {
      localStorage.setItem(STORAGE_KEY, t)
      apply(t)
    })
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggleTheme }
}
