<script setup lang="ts">
import { useTheme } from '~/features/theme-toggle/model/useTheme'
const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    :aria-label="theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'"
    :title="theme === 'light' ? 'Explore the cosmos' : 'Explore the organic world'"
    class="theme-toggle"
    @click="toggleTheme()"
  >
    <ClientOnly>
      <!-- In light mode: show spiral galaxy icon (hint at dark cosmic world) -->
      <svg v-if="theme === 'light'" class="theme-toggle__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <!-- Spiral arms -->
        <path d="M12 12c1-4 4-7 8-7" />
        <path d="M12 12c-1 4-4 7-8 7" />
        <path d="M12 12c4 1 7 4 7 8" />
        <path d="M12 12c-4-1-7-4-7-8" />
        <!-- Core glow -->
        <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.2" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <!-- Stars -->
        <circle cx="20" cy="4" r="0.7" fill="currentColor" />
        <circle cx="4" cy="20" r="0.7" fill="currentColor" />
        <circle cx="3" cy="8" r="0.5" fill="currentColor" opacity="0.6" />
        <circle cx="19" cy="18" r="0.5" fill="currentColor" opacity="0.6" />
      </svg>
      <!-- In dark mode: show symbiote icon (hint at light organic world) -->
      <svg v-else class="theme-toggle__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <!-- Symbiote body — organic blob -->
        <path d="M12 6c-2.5 0-5 1-6 3s-1 4.5.5 6.5S10 19 12 19s4-1.5 5.5-3.5S19 11 18 9s-3.5-3-6-3z" fill="currentColor" opacity="0.15" />
        <path d="M12 6c-2.5 0-5 1-6 3s-1 4.5.5 6.5S10 19 12 19s4-1.5 5.5-3.5S19 11 18 9s-3.5-3-6-3z" />
        <!-- Tentacles -->
        <path d="M7.5 9C5.5 7.5 3.5 7 2 7.5" />
        <path d="M6.5 14C4 15 2.5 16.5 2 18" />
        <path d="M16.5 9c2-1.5 4-2 5.5-1.5" />
        <path d="M17 15c1.5 1.5 3 2 4.5 1.5" />
        <!-- Nucleus -->
        <circle cx="12" cy="12.5" r="2" fill="currentColor" opacity="0.3" />
      </svg>
    </ClientOnly>
  </button>
</template>

<style scoped>
.theme-toggle {
  appearance: none;
  position: relative;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--muted);
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 200ms, border-color 200ms;
}

/* Pulsing conic-gradient border — always on */
.theme-toggle::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 11px;
  padding: 1px;
  background: conic-gradient(
    from var(--border-angle, 0deg),
    transparent 0%,
    var(--fg) 5%,
    transparent 15%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.5;
  animation: border-spin 3s linear infinite;
}

.theme-toggle:hover::before {
  opacity: 1;
}

.theme-toggle:hover {
  color: var(--fg);
}

.theme-toggle:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--accent-soft);
}

.theme-toggle__icon {
  display: block;
  animation: icon-breathe 3s ease-in-out infinite;
}

@keyframes border-spin {
  to { --border-angle: 360deg; }
}

@property --border-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

@keyframes icon-breathe {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.08); opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .theme-toggle::before { animation: none; }
  .theme-toggle__icon { animation: none; opacity: 0.8; }
}
</style>
