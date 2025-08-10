<script setup lang="ts">
import { useTheme } from '../app/composables/useTheme'
const { theme, toggleTheme } = useTheme()
</script>

<template>
  <header class="header">
    <nav class="nav">
      <strong class="brand">Pavel Zagvozdin</strong>
      <button class="theme-btn" @click="toggleTheme" :aria-label="`Toggle theme (current: ${theme})`">
        <span v-if="theme === 'dark'">🌙</span>
        <span v-else>☀️</span>
      </button>
    </nav>
  </header>
  
</template>

<style scoped>
.header { background: var(--bg-soft); border-bottom: 1px solid var(--accent); }
.nav { max-width: 1024px; margin: 0 auto; padding: 12px 16px; color: var(--fg); display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.brand { letter-spacing: 0.3px; }
.theme-btn { border: 1px solid var(--accent); color: var(--fg); background: transparent; padding: 6px 10px; border-radius: 8px; cursor: pointer; }
</style>
