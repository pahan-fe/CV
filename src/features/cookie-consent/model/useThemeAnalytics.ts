import type { Theme } from '~/features/theme-toggle/model/useTheme'

let lastSwitchTime = 0
let darkMs = 0
let lightMs = 0
let currentTheme: Theme = 'dark'
let trackingStarted = false

const flushDelta = () => {
  const now = Date.now()
  const delta = now - lastSwitchTime
  if (currentTheme === 'dark') {
    darkMs += delta
  } else {
    lightMs += delta
  }
  lastSwitchTime = now
}

export const useThemeAnalytics = () => {
  const { gtag } = useGtag()

  const start = (theme: Theme) => {
    if (trackingStarted) {
      return
    }
    trackingStarted = true
    currentTheme = theme
    lastSwitchTime = Date.now()

    gtag('event', 'theme_initial', { theme })

    window.addEventListener('beforeunload', () => {
      flushDelta()
      gtag('event', 'theme_duration', {
        dark_seconds: Math.round(darkMs / 1000),
        light_seconds: Math.round(lightMs / 1000),
      })
    })
  }

  const trackToggle = (newTheme: Theme) => {
    if (!trackingStarted) {
      return
    }
    flushDelta()
    currentTheme = newTheme
    gtag('event', 'theme_toggle', { theme_to: newTheme })
  }

  return { start, trackToggle }
}
