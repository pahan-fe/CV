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
    <svg v-if="theme === 'light'" width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  </button>
</template>

<style scoped>
button {
  appearance: none;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--muted);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 200ms, border-color 200ms, background-color 200ms;
}

button:hover {
  color: var(--accent);
  border-color: var(--accent);
}

button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--accent-soft);
}

svg { display: block; }
</style>
