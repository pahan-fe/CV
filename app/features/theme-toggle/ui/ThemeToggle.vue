<script setup lang="ts">
import { useTheme } from '~/features/theme-toggle/model/useTheme'
const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    :aria-label="theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'"
    :title="theme === 'light' ? 'Dark theme' : 'Light theme'"
    @click="toggleTheme()"
  >
    <svg v-if="theme === 'light'" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" />
      <path fill="none" stroke="currentColor" d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
    </svg>
  </button>
</template>

<style scoped>
button {
  appearance: none;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--fg);
  border-radius: 999px;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  line-height: 1;
  cursor: pointer;
  transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
  font: inherit;
}

button:hover {
  border-color: color-mix(in srgb, var(--muted) 40%, var(--border));
  background: color-mix(in srgb, var(--muted) 14%, var(--bg));
  transform: translateY(-1px);
}

button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--muted) 35%, transparent);
}

button:active {
  transform: translateY(0);
}

/* Ensure crisp icon alignment */
svg { display: block; }
</style>
