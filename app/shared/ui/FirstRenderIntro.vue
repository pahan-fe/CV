<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
const emit = defineEmits<{ (e: 'done'): void }>()

// Local state to drive CSS classes; we don't rely on v-if for the animation itself
const visible = ref(true)

// Allow user to click or press a key to skip
function finish() {
  if (!visible.value) return
  visible.value = false
  // give CSS time to animate out before notifying parent
  setTimeout(() => emit('done'), 300)
}

onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish()
  }
  window.addEventListener('keydown', onKey)
  // Auto-finish after 1.2s (short, non-intrusive)
  const t = setTimeout(finish, 1200)
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKey)
    clearTimeout(t)
  })
})
</script>

<template>
  <div
    class="intro"
    :class="{ 'intro--hidden': !visible }"
    role="dialog"
    aria-live="polite"
    aria-label="Intro animation"
    @click="finish"
  >
    <div class="intro__logo" aria-hidden="true">
      <div class="ring"></div>
      <span class="mark">pahan.z</span>
    </div>
    <p class="intro__hint">Tap or press Enter to skip</p>
  </div>
  
</template>

<style scoped>
.intro {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background: radial-gradient(1200px 600px at 50% -10%, color-mix(in srgb, var(--bg-soft) 70%, var(--bg)) 0%, var(--bg) 60%);
  color: var(--fg);
  user-select: none;
  -webkit-user-select: none;
  transition: opacity 280ms ease, visibility 280ms ease;
}
.intro--hidden { opacity: 0; visibility: hidden; }

.intro__logo {
  position: relative;
  display: inline-grid;
  place-items: center;
  padding: 18px 28px;
  border-radius: 999px; /* pill that wraps the text */
  min-width: 112px; /* still looks balanced if text is very short */
  min-height: 112px; /* preserves a circular feel */
  filter: drop-shadow(0 10px 30px color-mix(in srgb, var(--accent) 15%, transparent));
  animation: pop-in 460ms cubic-bezier(.2,.8,.2,1) both;
}

.ring {
  position: absolute;
  inset: 0;
  border-radius: inherit; /* match the pill shape */
  background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 35%, transparent), transparent 70%);
  border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border, #2a2a2a));
  transform-origin: 50% 50%;
  animation: pulse 900ms ease-in-out 80ms both;
}

.mark {
  position: relative;
  font-weight: 800;
  letter-spacing: 0.5px;
  font-size: 28px;
  line-height: 1;
  background: linear-gradient(180deg, var(--fg), color-mix(in srgb, var(--fg) 70%, var(--accent)));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transform: translateY(4px);
  animation: rise 800ms cubic-bezier(.2,.8,.2,1) 80ms both;
  white-space: nowrap;
}

.intro__hint {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  opacity: 0.55;
  font-size: 0.85rem;
}

@keyframes pop-in {
  0% { transform: scale(0.86); opacity: 0; }
  60% { transform: scale(1.04); opacity: 1; }
  100% { transform: scale(1); }
}

@keyframes pulse {
  0% { transform: scale(0.7); opacity: 0; }
  40% { opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes rise {
  0% { transform: translateY(12px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .intro__logo, .ring, .mark { animation: none !important; }
  .intro { transition-duration: 120ms; }
}

/* Responsive font sizing to ensure long labels fit nicely */
@media (max-width: 420px) {
  .mark { font-size: 24px; }
  .intro__logo { min-width: 100px; min-height: 100px; padding: 16px 22px; }
}
</style>
