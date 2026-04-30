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
    <span class="theme-toggle__disk" aria-hidden="true" />
    <span class="theme-toggle__ring theme-toggle__ring--1" aria-hidden="true" />
    <span class="theme-toggle__ring theme-toggle__ring--2" aria-hidden="true" />
    <span class="theme-toggle__ring theme-toggle__ring--3" aria-hidden="true" />
    <ClientOnly>
      <!-- Light mode: spiral galaxy. Dark mode: symbiote. -->
      <svg v-if="theme === 'light'" class="theme-toggle__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 12c1-4 4-7 8-7" />
        <path d="M12 12c-1 4-4 7-8 7" />
        <path d="M12 12c4 1 7 4 7 8" />
        <path d="M12 12c-4-1-7-4-7-8" />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.2" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="20" cy="4" r="0.7" fill="currentColor" />
        <circle cx="4" cy="20" r="0.7" fill="currentColor" />
        <circle cx="3" cy="8" r="0.5" fill="currentColor" opacity="0.6" />
        <circle cx="19" cy="18" r="0.5" fill="currentColor" opacity="0.6" />
      </svg>
      <svg v-else class="theme-toggle__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 6c-2.5 0-5 1-6 3s-1 4.5.5 6.5S10 19 12 19s4-1.5 5.5-3.5S19 11 18 9s-3.5-3-6-3z" fill="currentColor" opacity="0.15" />
        <path d="M12 6c-2.5 0-5 1-6 3s-1 4.5.5 6.5S10 19 12 19s4-1.5 5.5-3.5S19 11 18 9s-3.5-3-6-3z" />
        <path d="M7.5 9C5.5 7.5 3.5 7 2 7.5" />
        <path d="M6.5 14C4 15 2.5 16.5 2 18" />
        <path d="M16.5 9c2-1.5 4-2 5.5-1.5" />
        <path d="M17 15c1.5 1.5 3 2 4.5 1.5" />
        <circle cx="12" cy="12.5" r="2" fill="currentColor" opacity="0.3" />
      </svg>
    </ClientOnly>
  </button>
</template>

<style scoped>
.theme-toggle {
  appearance: none;
  position: relative;
  border: 0;
  background: var(--card);
  color: var(--muted);
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 200ms;
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
  animation: icon-wink 4s ease-out 3s infinite;
  will-change: transform, filter;
}

/* Black-hole layers — only rendered in dark theme */
.theme-toggle__disk,
.theme-toggle__ring {
  display: none;
}

/* ============ DARK theme: black hole + accretion disk ============ */
html[data-theme='dark'] .theme-toggle {
  background: #000;
  border-radius: 50%;
}

html[data-theme='dark'] .theme-toggle__disk {
  display: block;
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  background: conic-gradient(
    from var(--disk-angle, 0deg),
    transparent 0deg,
    rgba(255, 60, 10, 0) 25deg,
    rgba(255, 100, 30, 0.55) 55deg,
    rgba(255, 180, 70, 0.85) 80deg,
    rgba(255, 240, 200, 1) 95deg,
    rgba(255, 180, 70, 0.85) 110deg,
    rgba(255, 100, 30, 0.55) 135deg,
    rgba(255, 60, 10, 0) 175deg,
    transparent 220deg,
    transparent 270deg,
    rgba(255, 80, 20, 0.35) 305deg,
    rgba(255, 120, 40, 0.45) 325deg,
    rgba(255, 60, 10, 0.2) 345deg,
    transparent 360deg
  );
  filter: blur(15px);
  z-index: -1;
  animation: disk-spin 4.5s linear infinite;
  /* Mask out the centre so the disk is a ring, not a filled circle */
  -webkit-mask: radial-gradient(circle, transparent 19px, #000 26px);
  mask: radial-gradient(circle, transparent 19px, #000 26px);
}

html[data-theme='dark'] .theme-toggle__ring {
  display: block;
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 3px solid rgba(255, 170, 70, 0.55);
  filter: blur(3.5px);
  pointer-events: none;
  /* Below button bg → ring vanishes once it shrinks past the event horizon */
  z-index: -2;
  animation: suck 3s cubic-bezier(0.55, 0.05, 0.7, 0.4) infinite;
}

html[data-theme='dark'] .theme-toggle__ring--1 { animation-delay: 0s; }
html[data-theme='dark'] .theme-toggle__ring--2 { animation-delay: -1s; }
html[data-theme='dark'] .theme-toggle__ring--3 { animation-delay: -2s; }

/* ============ LIGHT theme: soft white halo ============ */
html[data-theme='light'] .theme-toggle::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
  pointer-events: none;
  z-index: -1;
  animation: halo-pulse 5s ease-in-out 2.1s infinite;
}

/* ============ Keyframes ============ */

@property --disk-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

@keyframes disk-spin {
  to { --disk-angle: 360deg; }
}

@keyframes suck {
  0%   { transform: scale(1.7) rotate(0deg);   opacity: 0; }
  20%  { opacity: 0.85; }
  70%  { opacity: 0.5; }
  100% { transform: scale(0.4) rotate(140deg); opacity: 0; }
}

@keyframes halo-pulse {
  0%, 100% { box-shadow: 0 0 22px rgba(255, 255, 255, 0.18); }
  50%      { box-shadow: 0 0 38px rgba(255, 255, 255, 0.32); }
}

@keyframes icon-wink {
  0%, 82%, 100% { transform: scale(1);    filter: drop-shadow(0 0 0 transparent); }
  87%           { transform: scale(1.20); filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7)); }
  92%           { transform: scale(0.96); filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.3)); }
  96%           { transform: scale(1);    filter: drop-shadow(0 0 0 transparent); }
}

@media (prefers-reduced-motion: reduce) {
  .theme-toggle,
  .theme-toggle__disk,
  .theme-toggle__ring,
  .theme-toggle__icon,
  .theme-toggle::after {
    animation: none !important;
  }
  .theme-toggle__icon { opacity: 0.85; }
}

@media print {
  .theme-toggle { display: none; }
}
</style>
